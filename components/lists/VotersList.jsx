import { ListItem, OrderedList } from '@chakra-ui/react'

export const VotersList = ({ scVoters }) => {
    return (
        <OrderedList>
            {scVoters && scVoters.map(scVoter =>
                <ListItem key={scVoter}>{scVoter}</ListItem>
            )}
        </OrderedList>
    )
}