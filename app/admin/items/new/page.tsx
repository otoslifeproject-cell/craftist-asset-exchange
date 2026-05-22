import { createItemAction } from '../actions';
import NewItemForm from './NewItemForm';
import './new-item-flow.css';

export default function NewItemPage() {
  return <NewItemForm action={createItemAction} />;
}
