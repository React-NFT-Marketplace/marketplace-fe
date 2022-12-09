import MetaMaskOnboarding from '@metamask/onboarding';
import React, { useState, useEffect, useRef } from 'react';
import { ButtonProps } from './types';

const OnboardingButton: React.FC<ButtonProps> = ({ handleNewAccount, handleChainChange, onFinishLoading, children, style, className, }: ButtonProps) => {
    const [isDisabled, setDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [chain, setChain] = useState(''); // networkVersion
    const [accounts, setAccounts] = useState<string[]>([]);
    const onboarding = useRef<MetaMaskOnboarding>();

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    useEffect(() => {
        if(isLoading) {
            return;
        }
        
        onFinishLoading();
    }, [isLoading, onFinishLoading])

    useEffect(() => {
        if(isLoading) {
            return;
        }

        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (accounts.length > 0) {
                setDisabled(true);
                handleNewAccount(accounts[0]);

                setChain(window.ethereum!.networkVersion ?? '');

                if(onboarding.current) {
                    onboarding.current.stopOnboarding();
                }
            } 
            
            else {
                handleNewAccount('');
                setChain('');
                setDisabled(false);
            }
        }
    }, [accounts, isLoading, handleNewAccount]);

    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            setTimeout(() => {
                if(!window.ethereum || !window.ethereum.isConnected()) {
                    setIsLoading(false);
                    return;
                }
                
                // get connected address
                if(!window.ethereum.selectedAddress) {
                    setDisabled(false);
                    setIsLoading(false);
                    return;
                }

                handleChainChange(window.ethereum!.networkVersion!);
                setChain(window.ethereum?.networkVersion ?? "");
                setAccounts([window.ethereum.selectedAddress]);
                setIsLoading(false);
            }, 500);

            const onAccountChanged = (newAccounts: any) => {
                if(Array.isArray(newAccounts)) {
                    if(typeof(newAccounts[0] === 'string')) {
                        setAccounts(newAccounts);
                    }
                }

                else {
                    setAccounts([]);
                }
            }
            window.ethereum!.on('accountsChanged', onAccountChanged);

            const onChainChanged = () => {
                handleChainChange(window.ethereum!.networkVersion!);
                setChain(window.ethereum!.networkVersion!);
            }
            window.ethereum!.on('chainChanged', onChainChanged);

            return () => {
                window.ethereum!.removeListener('accountsChanged', onAccountChanged);
                window.ethereum!.removeListener('chainChanged', onChainChanged);
            };
        }

        else {
            setDisabled(false);
        }
    }, [handleChainChange]);

    const onClick = () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            window.ethereum!
                .request({ method: 'eth_requestAccounts' })
                .then((newAccounts: any) => setAccounts(newAccounts));
        } else {
            if(onboarding.current) {
                onboarding.current.startOnboarding();
            }
        }
    };

    return (
        <button 
            disabled={isDisabled} 
            onClick={onClick}
            style={style}
            className={className}
        >
            {children}
        </button>
    );
}

export default OnboardingButton;