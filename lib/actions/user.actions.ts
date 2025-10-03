'use server';
import { email } from "zod";
import { createSessionClient } from "../appwrite";
import { createAdminClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { extractCustomerIdFromUrl, parseStringify } from "../utils";
import { plaidClient } from "../plaid";
import { CountryCode, Products } from "plaid";
import { ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum } from "plaid";
import { revalidatePath } from "next/cache";
import { encryptId } from "../utils";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import { error } from "console";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;


export const signIn = async ({email , password}: signInProps) => {
    try {

        //mutation / base de donnee / Faire une requête
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession({
            email,
            password
        })

        //Sauvegarder la session
        const cookieStore = await cookies();
        cookieStore.set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(session)
        
    } catch (error) {
        console.error('Error',error)
    }
}

export const signUp = async ( {password,...userData}: SignUpParams  ) => {

  const { email,firstName,lastName } = userData;

  let newUserAccount;

    try {

        //creer un compte
        const { account,database } = await createAdminClient();

        //Crée le compte Appwrite (système d'authentification)
        newUserAccount = await account.create(
            ID.unique(),           // userId
            email,                 // email  
            password,              // password
            `${firstName} ${lastName}` // name
        );

        if(!newUserAccount) throw new Error('Erreur de creation du compte');

        //Crée un client Dwolla (pour les paiements)
        const dwollaCustomerUrl = await createDwollaCustomer({
          ...userData,
          type: 'personal'
        })

        if(!dwollaCustomerUrl) throw new Error('Erreur de creation du customer dwolla');

        //Cette fonction extrait l'ID du client depuis une URL Dwolla.
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)

        const newUser = await database.createDocument(
          DATABASE_ID!,
          USER_COLLECTION_ID!,
          ID.unique(),
          {
            ...userData,
            userId: newUserAccount.$id,
            dwollaCustomerId,
            dwollaCustomerUrl
          }
        )


        const session = await account.createEmailPasswordSession({
            email,
            password
        });

        const cookieStore = await cookies();
        cookieStore.set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          });

          return parseStringify(newUser)
        
    } catch (error) {
        console.error('Error',error)
    }
}



export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const user =  await account.get();

      return parseStringify(user)
    } catch (error) {
      return null;
    }
  }

  export const logoutAccount = async () => {
    try{

        const {account} = await createSessionClient();

        const cookieStore = await cookies();
        cookieStore.delete('appwrite-session');

        await account.deleteSession('current')

    }
    catch(error){
        return null;
    }
  }


  export const createLinkToken = async (user: User) => {
    try {
        const tokenParms = {
            user: {
                client_user_id: user.$id
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: process.env.PLAID_PRODUCTS?.split(',') as Products[],
            language: 'en',
            country_codes: process.env.PLAID_COUNTRY_CODES?.split(',') as CountryCode[],
        }

        const response = await plaidClient.linkTokenCreate(tokenParms);
        return parseStringify({linkToken: response.data.link_token})
    }
    catch(error) {
        console.error('Erreur Plaid:', error);
    }
}



export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}:createBankAccountProps) => {
    try{
        const {database} = await createAdminClient();

        const bankAccount = await database.createDocument(
          DATABASE_ID!,
          BANK_COLLECTION_ID!,
          ID.unique(),
          {
            userId,
            bankId,
            accountId,
            accessToken,
            fundingSourceUrl,
            shareableId,
          }
        )

        return parseStringify(bankAccount)
    }
    catch(error){
        
    }
}



export const exchangePublicToken = async ({
    publicToken,
    user,
  }: exchangePublicTokenProps) => {
    try {
      // 1. Échange du token temporaire 🔄
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
  
      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;
      
      // 2. Récupération des comptes 🏦
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });
  
      const accountData = accountsResponse.data.accounts[0];
  
      // 3. Création du token Dwolla 💰
      const request: ProcessorTokenCreateRequest = {
        access_token: accessToken,
        account_id: accountData.account_id,
        processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
      };
  
      const processorTokenResponse = await plaidClient.processorTokenCreate(request);
      const processorToken = processorTokenResponse.data.processor_token;
  
       // Création de la source de financement 💳
       const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId,
        processorToken,
        bankName: accountData.name,
      });
      
      // If the funding source URL is not created, throw an error
      if (!fundingSourceUrl) throw Error;
  
      // 5. Sauvegarde en base de données 💾
      await createBankAccount({
        userId: user.$id,
        bankId: itemId,
        accountId: accountData.account_id,
        accessToken,
        fundingSourceUrl,
        shareableId: encryptId(accountData.account_id),
      });
  
      // Revalidate the path to reflect the changes
      revalidatePath("/");
  
      // Return a success message
      return parseStringify({
        publicTokenExchange: "complete",
      });
    } catch (error) {
      console.error("An error occurred while creating exchanging token:", error);
    }
  }
  

export const getBanks = async ({userId} : getBanksProps) =>{
  try{

    const {database} = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(banks.documents);

  }catch(error){
    console.log(error)
  }
}

export const getBank = async ({documentId} : getBankProps) =>{
  try{

    const {database} = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    )

    return parseStringify(bank.documents[0]);

  }catch(error){
    console.log(error)
  }
}