import { FormEvent, useState } from "react";
import Modal from "react-modal";
import closeImg from '../../../assets/close.svg';
import income from '../../../assets/income.svg';
import outcome from '../../../assets/outcome.svg';
import { useTransactions } from "../../hooks/useTransactions";
import { Loading } from "../Loading";
import { Container, TransactionType, RadioBox } from "./styles";

interface NewTransactionModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

export function NewTransactionModal({ isOpen, onRequestClose }: NewTransactionModalProps) {
    const { createTransaction } = useTransactions();

    const [isSending, setIsSending] = useState(false);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState('');
    const [type, setType] = useState('deposit');

    async function handleCreateNewTransaction(event: FormEvent) {
        event.preventDefault();

        if(!title && !amount && !category) return;

        setIsSending(true);

        await createTransaction({
          title,
          amount,
          category,
          type,
        });

        setTitle('')
        setAmount(0);
        setCategory('');
        setType('deposit')

        setIsSending(false)

        onRequestClose();
    }

    return(
        <Modal 
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          overlayClassName="react-modal-overlay"
          className="react-modal-content">
            <button 
              type="button"
              onClick={onRequestClose}
              className="react-modal-close">
                <img src={closeImg} alt="Fechar" />
            </button>
        
            <Container onSubmit={handleCreateNewTransaction}>
              <h2>Cadastrar transação</h2>
              <input 
              placeholder="Título"
              value={title}
              onChange={e => setTitle(e.target.value)} />

              <input 
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))} />

              <TransactionType>
                  <RadioBox
                    type="button"
                    onClick={() => setType('deposit')}
                    isActive={type === 'deposit'}
                    activeColor="green"
                    >
                      <img src={income} alt="Entrada" />
                      <span>Entrada</span>
                  </RadioBox>

                  <RadioBox
                    type="button"
                    onClick={() => setType('withdraw')}
                    isActive={type === 'withdraw'}
                    activeColor="red"
                    >
                      <img src={outcome} alt="Saída" />
                      <span>Saída</span>
                  </RadioBox>
              </TransactionType>

              <input
              placeholder="Categoria"
              value={category}
              onChange={e => setCategory(e.target.value)} />

              <button 
                type="submit" 
                disabled={isSending}>
                  { isSending ? <Loading /> : "Cadastrar" }
              </button>
            </Container>
        </Modal>
    );
}