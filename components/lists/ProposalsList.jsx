import { ListItem, OrderedList } from '@chakra-ui/react'

export const ProposalsList = ({ scProposalsArray }) => {
    return (
        <OrderedList>
            {scProposalsArray && scProposalsArray.map((scProposal, index) =>
                <ListItem key={index}>{scProposal}</ListItem>
            )}
        </OrderedList>
    )
}