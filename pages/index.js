// React
import { useState, useEffect } from 'react'
// Next
import Head from 'next/head'
// Ethers
import { ethers } from 'ethers'
// WagmiConfig
import { useAccount } from 'wagmi'
import { useProvider } from 'wagmi'
import { useSigner } from 'wagmi'
// RainbowKitProvider
// ChakraProvider
import { Flex } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Tab } from '@chakra-ui/react'
import { TabList } from '@chakra-ui/react'
import { TabPanel } from '@chakra-ui/react'
import { TabPanels } from '@chakra-ui/react'
import { Tabs } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
// Component & Dapp
import { Layout } from '@/components/layout/Layout.jsx'
import { ProposalsRegistrationStartedPanel } from '@/components/tabPanels/ProposalsRegistrationStartedPanel.jsx'
import { RegisteringVotersPanel } from '@/components/tabPanels/RegisteringVotersPanel.jsx'
import { VotesTalliedPanel } from '@/components/tabPanels/VotesTalliedPanel.jsx'
import { VotingSessionStartedPanel } from '@/components/tabPanels/VotingSessionStartedPanel.jsx'
import Contract from '../public/Voting.json'

export default function Home() {

  // Constants
  // -------------------------------------------------------------------------------------------------------------------
  // Addresses & Blocks
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SCADDRESS
  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS
  const DEPLOYMENT_BLOCK = process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK

  // Voting stages
  const REGISTERINGVOTERS = 0
  const PROPOSALSREGISTRATIONSTARTED = 1
  const PROPOSALSREGISTRATIONENDED = 2
  const VOTINGSESSIONSTARTED = 3
  const VOTINGSESSIONENDED = 4
  const VOTESTALLIED = 5

  // States for...
  // -------------------------------------------------------------------------------------------------------------------
  // ...the smartcontract (sc/SC) events
  const [scEvents, setSCEvents] = useState(null)
  // ...the smartcontract (sc/SC) variables
  const [scWorkflowStatus, setSCWorkflowStatus] = useState(REGISTERINGVOTERS)
  const [scVoters, setSCVoters] = useState([])
  const [scProposalsArray, setSCProposalsArray] = useState([])
  const [scWinningProposalID, setSCWinningProposalID] = useState([])

  // ...the Dapp status (indicates user interaction on the wallet)
  const [isLoading, setIsLoading] = useState(false)
  const [panelNumber, setPanelNumber] = useState(0)
  const [isRegistered, setIsRegistered] = useState(false)

  // ...the Dapp input values
  // const [_, set_] = useState(null)


  // Wagmi hooks for... (https://wagmi.sh/react/getting-started)
  // -------------------------------------------------------------------------------------------------------------------
  // ...accessing account data and connection status.
  const { address, isConnected } = useAccount()
  // ...accessing Client's ethers Provider.
  const provider = useProvider()
  // ...accessing ethers Signer object for connected account.
  const { data: signer } = useSigner()

  // RainbowKit
  // -------------------------------------------------------------------------------------------------------------------
  // ...RainbowKit A
  // ...RainbowKit B


  // ChakraProvider
  // -----------------------------------------------------------------------------------------------------------------


  // Variables
  // -------------------------------------------------------------------------------------------------------------------

  // `useEffect`s
  // -------------------------------------------------------------------------------------------------------------------
  // Calls 'getEvents()' whenever the users:
  // - connect their wallet to the Dapp (isConnected)
  // - change the account in their wallet (address)
  useEffect(() => {
    if (isConnected) {
      getEvents()
    }
  }, [isConnected, address, isRegistered /*, scVoters*/])

  // Calls 'getSCVoters()', 'getSCProposalsArray()', 'getSCWorkflowStatus()'
  // whenever the 'scEvents' status change
  useEffect(() => {
    if (isConnected) {
      getSCVoters()
      getSCProposalsArray()
      getSCWorkflowStatus()
      getSCwinningProposalID()
    }
  }, [scEvents])

  // Whenever the admin change the voting state
  useEffect(() => {
    if (isConnected) {

      switch (scWorkflowStatus) {
        case REGISTERINGVOTERS:
          setPanelNumber(0)
          break
        case PROPOSALSREGISTRATIONSTARTED:
        case PROPOSALSREGISTRATIONENDED:
          setPanelNumber(1)
          break
        case VOTINGSESSIONSTARTED:
        case VOTINGSESSIONENDED:
          setPanelNumber(2)
          break
        case VOTESTALLIED:
          setPanelNumber(3)
          break
        default:
          console.error("Incorrect `panelNumber` value: " + panelNumber + " for scWorkflowStatus: " + scWorkflowStatus);
          break;
      }
    }
  }, [scWorkflowStatus])


  // Functions
  // -------------------------------------------------------------------------------------------------------------------
  // Gets the previous events emited by the blockchain
  const getEvents = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Contract.abi, provider)

    let filter = {
      address: CONTRACT_ADDRESS,
      fromBlock: DEPLOYMENT_BLOCK
    }
    // let events = await contract.queryFilter(filter)
    let events = await contract.queryFilter("*", -3000, 'latest')
    setSCEvents(events)
  }

  // Gets the registered voters...
  const getSCVoters = async () => {
    // ...if there are
    if (scEvents.filter(event => event.event === "VoterRegistered").length) {

      let registeredVoters = scEvents
        .filter(event => event.event === "VoterRegistered")
        .map(e => e.args.voterAddress)

      setSCVoters(registeredVoters)

      // also sets if current address is registered
      setIsRegistered(registeredVoters.includes(address))
    }
  }

  // Gets the proposals...
  const getSCProposalsArray = async () => {
    // ...if user address is registered...
    if (isRegistered) { // #TODO arreglar error cuando se cambia de dirección registrada a no registrada en metamask sin refrescar página
      // ...and if there are proposals,...
      if (scEvents.filter(event => event.event === "ProposalRegistered").length) {

        let proposals = []
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Contract.abi, provider)

        // ...via their proposalId
        scEvents
          .filter(event => event.event === "ProposalRegistered")
          .map(async (e) => {
            let transaction = await contract.connect(address).getOneProposal(e.args.proposalId.toNumber())
            proposals = [...proposals, transaction.description]
            setSCProposalsArray(proposals)
          })
      }
    }
  }

  // Gets the voting stage...
  const getSCWorkflowStatus = async () => {
    // ...if there are
    if (scEvents.filter(event => event.event === "WorkflowStatusChange").length) {
      let votingStage = scEvents
        .filter(event => event.event === "WorkflowStatusChange")
        .map(e => e.args.newStatus)
        .slice(-1)
        [0]

      setSCWorkflowStatus(votingStage)
    }
  }

  // Gets the winner proposal
  const getSCwinningProposalID = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Contract.abi, provider)
    let transaction = await contract.connect(address).winningProposalID()
    setSCWinningProposalID(transaction.toNumber())
  }


  // HTML Content
  // -------------------------------------------------------------------------------------------------------------------
  return (
    <>
      <Head>
        <title>Voting DApp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Flex direction="column" p="2rem" alignItems="center" width="100%">
          <Heading mb="2rem">Voting system</Heading>
          {isConnected ? (
            <Tabs defaultIndex={panelNumber}>
            {/* #TODO: defaultIndex={scWorkflowStatus} no se refresca directamente*/}
            {/* OJO: solo va de 0 a 3 = 4 pestañas. No 0 a 5 Voting stages*/}
              <TabList>
                <Tab isDisabled = {scWorkflowStatus !== REGISTERINGVOTERS}>
                  1 . Voters registration
                </Tab>
                <Tab isDisabled = {scWorkflowStatus !== PROPOSALSREGISTRATIONSTARTED && scWorkflowStatus !== PROPOSALSREGISTRATIONENDED}>
                  2 . Proposals registration
                </Tab>
                <Tab isDisabled = {scWorkflowStatus !== VOTINGSESSIONSTARTED && scWorkflowStatus !== VOTINGSESSIONENDED}>
                  3 . Voting session
                </Tab>
                <Tab isDisabled = {scWorkflowStatus !== VOTESTALLIED}>
                  4 . Voting results
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <RegisteringVotersPanel isRegistered={isRegistered}
                                          scWorkflowStatus={scWorkflowStatus}
                                          setSCWorkflowStatus={setSCWorkflowStatus}
                                          scVoters={scVoters} setSCVoters={setSCVoters}>
                  </RegisteringVotersPanel>
                </TabPanel>
                <TabPanel>
                  <ProposalsRegistrationStartedPanel isRegistered={isRegistered}
                                                     scWorkflowStatus={scWorkflowStatus}
                                                     setSCWorkflowStatus={setSCWorkflowStatus}
                                                     scProposalsArray={scProposalsArray} setSCProposalsArray={setSCProposalsArray}>
                  </ProposalsRegistrationStartedPanel>
                </TabPanel>
                <TabPanel>
                  <VotingSessionStartedPanel isRegistered={isRegistered}
                                             scWorkflowStatus={scWorkflowStatus}
                                             setSCWorkflowStatus={setSCWorkflowStatus}
                                             scProposalsArray={scProposalsArray}>
                  </VotingSessionStartedPanel>
                </TabPanel>
                <TabPanel>
                  <VotesTalliedPanel scWinningProposalID={scWinningProposalID}>
                  </VotesTalliedPanel>
                </TabPanel>
              </TabPanels>
            </Tabs>
            ) : (
              <Flex p="2rem" justifyContent="center">
                <Text>Please, connect your wallet to use Voting DApp</Text>
              </Flex>
            )}
        </Flex>
      </Layout>
    </>
  )
}
