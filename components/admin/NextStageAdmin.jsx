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
import { Card } from '@chakra-ui/react'
import { CardBody } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
// Component & Dapp
import Contract from 'public/Voting.json'


export const NextStageAdmin = ({ children, scWorkflowStatus, setSCWorkflowStatus }) => {


    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SCADDRESS
    const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS


    // Voting stages
    const REGISTERINGVOTERS = 0
    const PROPOSALSREGISTRATIONSTARTED = 1
    const PROPOSALSREGISTRATIONENDED = 2
    const VOTINGSESSIONSTARTED = 3
    const VOTINGSESSIONENDED = 4
    const VOTESTALLIED = 5

    // // States for...
    // // -----------------------------------------------------------------------------------------------------------------
    // // ...the voterAddress input
    // const [voterAddress, setVoterAddress] = useState(null)


    // Wagmi hooks for... (https://wagmi.sh/react/getting-started)
    // -----------------------------------------------------------------------------------------------------------------
    // ...accessing account data and connection status.
    const { address, isConnected } = useAccount()
    // // ...accessing Client's ethers Provider.
    // const provider = useProvider()
    // // ...accessing ethers Signer object for connected account.
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
    let nextStageString = ""


    // `useEffect`s
    // -----------------------------------------------------------------------------------------------------------------


    // Functions
    // -----------------------------------------------------------------------------------------------------------------
    // Sets the next voting stage
    const setNextVotingStage = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, Contract.abi, signer)
            let transaction

            switch (scWorkflowStatus) {
                case REGISTERINGVOTERS:
                    nextStageString = "Proposals registration started"
                    transaction = await contract.startProposalsRegistering()
                    break
                case PROPOSALSREGISTRATIONSTARTED:
                    nextStageString = "Proposals registration ended"
                    transaction = await contract.endProposalsRegistering()
                    break
                case PROPOSALSREGISTRATIONENDED:
                    nextStageString = "Voting session started"
                    transaction = await contract.startVotingSession()
                    break
                case VOTINGSESSIONSTARTED:
                    nextStageString = "Voting session ended"
                    transaction = await contract.endVotingSession()
                    break
                case VOTINGSESSIONENDED:
                    nextStageString = "Votes tallied"
                    transaction = await contract.tallyVotes()
                    break
                default:
                    toast({
                        title: 'Error setting the next voting stage',
                        description: "Wrong stage value",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                    break;
            }

            await transaction.wait() // = wait(1)

            setSCWorkflowStatus(scWorkflowStatus + 1)

            toast({
                title: 'Voting stage updated:',
                description: nextStageString,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: 'Error setting the next voting stage',
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
        <Card mt='1rem' mb='2rem'>
            <CardBody>
                <Flex>
                    <Text>Only you, admin, can see this card.</Text>
                    {scWorkflowStatus < VOTESTALLIED ? (
                        <Button variant='solid' colorScheme='blue' onClick={() => setNextVotingStage() }>Go to next stage</Button>
                    ) : (
                        <Text>This is the last stage on the voting</Text>
                    )}
                </Flex>
                {children}
            </CardBody>
        </Card>
    )
}