// React
import { useState, useEffect } from 'react'
// Next
// Ethers
import { ethers } from 'ethers'
// WagmiConfig
import { useAccount, useProvider, useSigner } from 'wagmi'
// RainbowKitProvider
// ChakraProvider
import { Table } from '@chakra-ui/react'
import { TableCaption } from '@chakra-ui/react'
import { TableContainer } from '@chakra-ui/react'
import { Tbody } from '@chakra-ui/react'
import { Td } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Th } from '@chakra-ui/react'
import { Thead } from '@chakra-ui/react'
import { Tr } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
// Component & Dapp
import { NextStageAdmin } from '@/components/admin/NextStageAdmin.jsx'
import { UserNotRegistered } from '@/components/user_not_registered/UserNotRegistered.jsx'

export const VotesTalliedPanel = ({ scWinningProposalID }) => {

    // Constants
    // -----------------------------------------------------------------------------------------------------------------
    // Addresses
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SCADDRESS
    const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS


    // States for...
    // -----------------------------------------------------------------------------------------------------------------
    // ...the voterAddress input
    // const [proposalChosen, setProposalChosen] = useState(null)
    // const [proposalVoted, setProposalVoted] = useState(null)


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


    // HTML content
    // -----------------------------------------------------------------------------------------------------------------
    return (
        <>
            {/* {admin && <NextStageAdmin scWorkflowStatus={scWorkflowStatus} setSCWorkflowStatus={setSCWorkflowStatus}></NextStageAdmin>} */}

            <Text>The winner is proposal #{scWinningProposalID + 1}</Text>
            <br></br>
            {/* <TableContainer>
                <Table size="sm" variant='striped'>
                    <TableCaption>Voting results</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Proposal</Th>
                            <Th isNumeric>Votes</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {scProposalsArray && scProposalsArray.map((scProposal, index) =>
                            <>
                                <Tr key={index}>
                                    <Td>{scProposal}</Td>
                                    <Td isNumeric>{voteCount}</Td>
                                </Tr>
                            </>
                        )}
                        <Tr><Td>Proposal #1</Td><Td isNumeric>11</Td></Tr>
                        <Tr><Td>Proposal #2</Td><Td isNumeric>12</Td></Tr>
                        <Tr><Td>Proposal #3</Td><Td isNumeric>13</Td></Tr>
                    </Tbody>
                </Table>
            </TableContainer> */}
        </>
    )
}