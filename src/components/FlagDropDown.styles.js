import styled from 'styled-components'

const ArrowBase = styled.div`
    font-size: 6px;
    margin-left: 5px;
`

export const UpArrow = styled(ArrowBase)`
    &:after {
        content: "▲";
    }
`

export const DownArrow = styled(ArrowBase)`
    &:after {
        content: "▼";
    }
`

export const SelectedFlagPopoverButton = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
`
