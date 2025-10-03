/*import React from 'react'
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccounts,getAccount } from '@/lib/actions/bank.actions'

const Home = async ({searchParams : {id,page}} : SearchParamProps) => {

  const loggedIn = await getLoggedInUser()

  const accounts = await getAccounts({
    userId: loggedIn.$id
  })

  if(!accounts) return;

  const accountsData = accounts?.data

  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({appwriteItemId})

  return (
    <section className='home'>
       <div className='home-content'>
        <header className='home-header'>
          <HeaderBox 
            type="greeting"
            title="Bienvenue"
            user={loggedIn?.name || 'Guest'}
            subtext="Accédez à votre compte et gérez vos transactions efficacement."
          
          />

          <TotalBalanceBox
             accounts={[accountsData]}
             totalBanks={accounts?.totalBanks}
             totalCurrentBalance={ accounts?.totalCurrentBalance }
          
          />
        </header>

        RECENT TRANSACTION
       </div>

       <RightSidebar 
        user={loggedIn}
        transactions={[account?.transactions]}
        banks={accountsData?.slice(0,2)}
       />
    </section>
  )
}

export default Home
*/
import React from 'react'
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccounts,getAccount } from '@/lib/actions/bank.actions'

const Home = async ({searchParams : {id,page}} : SearchParamProps) => {

  const loggedIn = await getLoggedInUser()

  const accounts = await getAccounts({
    userId: loggedIn.$id
  })

  if(!accounts) return;

  const accountsData = accounts?.data

  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  // ✅ MODIFICATION ICI : Ajouter la vérification
  const account = appwriteItemId ? await getAccount({appwriteItemId}) : null;

  return (
    <section className='home'>
       <div className='home-content'>
        <header className='home-header'>
          <HeaderBox 
            type="greeting"
            title="Bienvenue"
            user={loggedIn?.name || 'Guest'}
            subtext="Accédez à votre compte et gérez vos transactions efficacement."
          
          />

          <TotalBalanceBox
             accounts={accountsData}  // ✅ MODIFIER ICI : Enlever les []
             totalBanks={accounts?.totalBanks}
             totalCurrentBalance={ accounts?.totalCurrentBalance }
          
          />
        </header>

        RECENT TRANSACTION
       </div>

       <RightSidebar 
        user={loggedIn}
        transactions={account?.transactions || []}  // ✅ MODIFIER ICI
        banks={accountsData?.slice(0,2)}
       />
    </section>
  )
}

export default Home