import styled from "styled-components";

export const Container = styled.div`
  .loading{
        animation: loading 2s linear infinite;
    }

    @keyframes loading {
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
`