import { Link } from '@chakra-ui/react'

// Hay varias maneras de exportar/importar modulos:
// Explicación muy clara: https://javascript.info/import-export#summary

export const NavBar = () => {
    return (
        <>
            <Link>Home</Link>
            <Link>Add a job</Link>
        </>
    )
};