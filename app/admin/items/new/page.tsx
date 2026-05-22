import { createItemAction } from '../actions';
import NewItemForm from './NewItemForm';

export default function NewItemPage() {
  return <NewItemForm action={createItemAction} />;
}
