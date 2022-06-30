import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  handleRemoveTransaction: (id: number) => void
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);


export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        api.get('transactions')
        .then(response => setTransactions(response.data.transactions));
    }, []);

    async function createTransaction(transactionInput: TransactionInput) {

      const response = await api.post('/transactions', {
        ...transactionInput,
        createdAt: new Date(),
      });

      const { transaction } = response.data; //Retorna os dados das transactions dentro da response.data

      setTransactions([
        ...transactions,
        transaction,
      ])
    }

    
    function handleRemoveTransaction(id: number) {
      const filteredTransaction = transactions.filter(transaction => transaction.id != id);

      setTransactions(filteredTransaction);
  }

    return(
      <TransactionsContext.Provider value={{ transactions, createTransaction, handleRemoveTransaction }}>
          {children}
      </TransactionsContext.Provider>
    )
}

export function useTransactions(){
  const context = useContext(TransactionsContext);

  return context;
}