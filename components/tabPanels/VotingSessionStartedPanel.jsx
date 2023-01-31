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
import { Radio } from '@chakra-ui/react'
import { RadioGroup } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
// Component & Dapp
import { NextStageAdmin } from '@/components/admin/NextStageAdmin.jsx'
import { UserNotRegistered } from '@/components/user_not_registered/UserNotRegistered.jsx'
import Contract from 'public/Voting.json'

export const VotingSessionStartedPanel = ({ isRegistered, scWorkflowStatus, setSCWorkflowStatus, scProposalsArray }) => {

    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SCADDRESS
    const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS

    // Voting stages
    const VOTINGSESSIONSTARTED = 3


    // States for...
    // -----------------------------------------------------------------------------------------------------------------
    // ...the voterAddress input
    const [proposalChosen, setProposalChosen] = useState(null)
    const [proposalVoted, setProposalVoted] = useState(null)


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
    // Whenever the admin registers an address
    // ...


    // Functions
    // -----------------------------------------------------------------------------------------------------------------
    // Vote for a selected proposal
    const vote = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, Contract.abi, signer)
            let transaction = await contract.setVote(proposalChosen)
            await transaction.wait() // = wait(1)
            setProposalVoted([proposalChosen])
            toast({
                title: 'Succes voting',
                description: 'Proposal voted: ' + scProposalsArray[proposalChosen],
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
                    {(scWorkflowStatus !== VOTINGSESSIONSTARTED) &&
                    <>
                        <Text>The voting period is closed. Wait for the voting counting</Text>
                        <Text mb="2rem">You can see your voted proposal below</Text>
                    </>
                    }

                    <FormControl>
                        <FormLabel>Proposals</FormLabel>
                        <RadioGroup onChange={setProposalChosen} value={proposalChosen}>
                            <Stack>
                                {scProposalsArray && scProposalsArray.map((scProposal, index) =>
                                    <Radio isDisabled={scWorkflowStatus !== VOTINGSESSIONSTARTED}
                                            key={index}
                                            value={index}>{scProposal}
                                    </Radio>
                                )}
                                {/* <Radio key="11" value="11">11</Radio> */}
                                {/* <Radio key="12" value="12">12</Radio> */}
                                {/* <Radio key="13" value="13">13</Radio> */}
                                {/* <Radio key="14" value="14">14</Radio> */}
                            </Stack>
                        </RadioGroup>
                        <Button isDisabled={scWorkflowStatus !== VOTINGSESSIONSTARTED} mt={4} mb={4} colorScheme='blue' type='submit' onClick={() => vote()}>Vote</Button>
                    </FormControl>
                </>
            ) : (
                <UserNotRegistered></UserNotRegistered>
            )}
        </>
    )
}