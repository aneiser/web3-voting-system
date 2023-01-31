// React
import { useState, useEffect } from 'react'
// Next
// Ethers
import { ethers } from 'ethers'
// WagmiConfig
import { useAccount, useProvider, useSigner } from 'wagmi'
// RainbowKitProvider
// ChakraProvider
import { Button } from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/react'
import { FormLabel } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
// Component & Dapp
import { NextStageAdmin } from '@/components/admin/NextStageAdmin.jsx'
import { UserNotRegistered } from '@/components/user_not_registered/UserNotRegistered.jsx'
import { VotersList } from '../lists/VotersList'
import Contract from 'public/Voting.json'

export const RegisteringVotersPanel = ({ isRegistered, scWorkflowStatus, setSCWorkflowStatus, scVoters, setSCVoters }) => {

    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SCADDRESS
    const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS


    // States for...
    // -----------------------------------------------------------------------------------------------------------------
    // ...the voterAddress input
    const [voterAddress, setVoterAddress] = useState(null)


    // Wagmi hooks for... (https://wagmi.sh/react/getting-started)
    // -----------------------------------------------------------------------------------------------------------------
    // ...accessing account data and connection status.
    const { address, isConnected } = useAccount()
    // ...accessing Client's ethers Provider.
    const provider = useProvider()
    // ...accessing ethers Signer object for connected account.
    const { data: signer } = useSigner()


    // RainbowKit
    // -----------------------------------------------------------------------------------------------------------------
    // ...RainbowKit A
    // ...RainbowKit B


    // ChakraProvider
    // -----------------------------------------------------------------------------------------------------------------
    const toast = useToast()


    // Variables
    // -----------------------------------------------------------------------------------------------------------------
    const admin = ADMIN_ADDRESS === address;

    // `useEffect`s
    // -----------------------------------------------------------------------------------------------------------------


    // Functions
    // -----------------------------------------------------------------------------------------------------------------
    // Registers an address
    const registerAddress = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, Contract.abi, signer)
            let transaction = await contract.addVoter(voterAddress)
            await transaction.wait() // = wait(1)
            setSCVoters([...scVoters, voterAddress])
            toast({
                title: 'Succes registering the address',
                description: 'Address registered: ' + voterAddress,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: 'Error registering the address',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }


    // HTML content
    // -----------------------------------------------------------------------------------------------------------------
    return (
        <>
            {admin && <NextStageAdmin scWorkflowStatus={scWorkflowStatus} setSCWorkflowStatus={setSCWorkflowStatus}>
                <FormControl>
                    <FormLabel>Register address as a voter</FormLabel>
                    <Input placeholder="Type an ethereum address" onChange={(e) => { setVoterAddress(e.target.value) }} />
                    <Button mt={4} mb={4} colorScheme='blue' type='submit' onClick={() => registerAddress()}>Register address</Button>
                </FormControl>
                <VotersList scVoters={scVoters}></VotersList>
            </NextStageAdmin>
            }

            {isRegistered ? (
                <Text>You have been registered. Wait for the admin to start the proposal registration period.</Text>
            ) : (
                <UserNotRegistered></UserNotRegistered>
            )}
        </>
    )
}