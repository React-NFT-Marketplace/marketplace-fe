import React, { useState, useEffect } from 'react';
import { runIfFunction } from '../../../common/utils';
import { ChainConfig } from '../ChainConfigs/types';
import { ButtonProps } from './types';
import MetaMaskOnboarding from '@metamask/onboarding';
import { ethers } from 'ethers';

export const hexlify = (chainId: number) => {
    return ethers.utils.hexlify(chainId).replace("0x0", "0x");
}

export const requestSwitchChain = async(
    targetChain: ChainConfig,
    onSuccess?: () => void,
    onError?: (e: any) => void,
) => {
    let {
        id, 
        name: chainName,
        nativeCurrency,
        rpc
    } = targetChain;

    let chainId = hexlify(id);
    
    try {
        await window.ethereum!.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }]
        });

        runIfFunction(onSuccess);
    } 
    catch (e: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (e.code === 4902 || e.data?.originalError?.code === 4902) {

            try {
                await window.ethereum!.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName,
                            chainId,
                            nativeCurrency,
                            rpcUrls: [rpc]
                        }
                    ]
                });
            }

            catch(e) {
                runIfFunction(onError, e);
            }
        }

        else {
            runIfFunction(onError, e);
        }
    }
}

const Switcher: React.FC<ButtonProps> = ({ 
    style, 
    className, 
    children,
    handleChainChange,  
    handleUserRejection,
    handleUnknownError,
    targetChain,
    hide,
    currentChainId,
}: ButtonProps) => {
    const [isRequesting, setIsRequesting] = useState(false);
    const [chain, setChain] = useState<number>(-1);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if(currentChainId !== undefined && currentChainId !== null) {
            setChain(currentChainId);
        }
    }, [currentChainId]);

    useEffect(() => {
        if(chain && chain !== -1) {
            //only handle chain change when chain is not empty
            //handle disconnect with connector
            handleChainChange(chain);
        }

        setIsDisabled(chain === targetChain.id);
    }, [handleChainChange, chain, targetChain]);
    
    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            setTimeout(() => {
                if(!window.ethereum || !window.ethereum.isConnected()) {
                    return;
                }
                
                // get connected address
                if(!window.ethereum.selectedAddress) {
                    return;
                }

                setChain(parseInt(window.ethereum.networkVersion!) ?? -1);
            }, 500);
        }
    }, []);

    const onSuccess = () => {
        setChain(chain);
        handleChainChange(chain);
        setIsRequesting(false);
    }

    const onError = (e: any) => {
        if(e.code === 4001) {
            runIfFunction(handleUserRejection);
        }

        else {
            runIfFunction(handleUnknownError);
        }

        setIsRequesting(false);
    }

    const onClick = () => {
        if(isRequesting) {
            return; 
        }

        setIsRequesting(true);

        requestSwitchChain(
            targetChain,
            onSuccess,
            onError,
        );
    };

    if(hide) {
        return null;
    }

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

export default Switcher;