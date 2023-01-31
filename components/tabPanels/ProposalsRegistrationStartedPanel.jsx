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
import { ProposalsList } from '../lists/ProposalsList.jsx'
import { UserNotRegistered } from '@/components/user_not_registered/UserNotRegistered.jsx'
import Contract from 'public/Voting.json'

export const ProposalsRegistrationStartedPanel = ({ isRegistered, scWorkflowStatus, setSCWorkflowStatus, scProposalsArray, setSCProposalsArray }) => {

    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SCADDRESS
    const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS


    // Voting stages
    const PROPOSALSREGISTRATIONSTARTED = 1

    // States for...
    // -----------------------------------------------------------------------------------------------------------------
    // ...the voterAddress input
    const [proposalDesc, setProposalDesc] = useState(null)


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
    const registerProposal = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, Contract.abi, signer)
            let transaction = await contract.addProposal(proposalDesc)
            await transaction.wait() // = wait(1)
            setSCProposalsArray([...scProposalsArray, proposalDesc])
            toast({
                title: 'Succes registering the proposal',
                description: 'Proposal registered: ' + proposalDesc,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: 'Error registering the proposal',
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
            {admin && <NextStageAdmin scWorkflowStatus={scWorkflowStatus} setSCWorkflowStatus={setSCWorkflowStatus}></NextStageAdmin>}

            {isRegistered ? (
                <>
                    {scWorkflowStatus === PROPOSALSREGISTRATIONSTARTED ? (
                        <FormControl>
                            <FormLabel>Enter your proposal</FormLabel>
                            <Input placeholder="Briefly describe your proposal" onChange={(e) => { setProposalDesc(e.target.value) }} />
                            <Button mt={4} mb={4} colorScheme='blue' type='submit' onClick={() => registerProposal()}>Save proposal</Button>
                        </FormControl>
                    ) : (
                        <>
                        <Text>The proposal registration period is closed. Wait for the voting peridod to start</Text>
                        <Text mb="2rem">You can see all the proposals below</Text>
                        </>
                    )}
                    <ProposalsList scProposalsArray={scProposalsArray}></ProposalsList>
                </>
            ) : (
                <UserNotRegistered></UserNotRegistered>
            )}

        </>
    )
}