"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions } from 'react-plaid-link';
import { useRouter } from 'next/navigation';
import { StyledString } from 'next/dist/build/swc/types';
import { usePlaidLink } from 'react-plaid-link';
import { createLinkToken } from '@/lib/actions/user.actions';
import { exchangePublicToken } from '@/lib/actions/user.actions';

const PlaidLink = ({user,variant}: PlaidLinkProps) => {
  const router = useRouter();

  const [token,setToken] = useState('');

  useEffect(() =>{
    const getLinktoken = async ()=> {
      const data = await createLinkToken(user);

      setToken(data?.linkToken);
    }

    getLinktoken();
  },[user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token:string) =>{
    await exchangePublicToken({
       publicToken:public_token,
       user
     });

    router.push('/');
  },[user])

  const config: PlaidLinkOptions = {
    token,
    onSuccess
  }

  const {open,ready} = usePlaidLink(config);

  return (
    <>
         {variant === 'primary' ? (
            <Button
              onClick={() => open()}
              disabled={!ready}
              className='plaidlink-primary'
            >
                se connecter a sa banque
            </Button>
         ) : variant === 'ghost' ? (
            <Button variant="ghost">
                se connecter a sa banque
            </Button>
         ) : (
            <Button>
                se connecter a sa banque
            </Button>
         )}
    </>
  )
}

export default PlaidLink