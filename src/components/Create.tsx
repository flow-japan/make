import { useState, useEffect } from 'react';
import { ItemTemplateTable } from '../components/ItemTemplateTable';
import { CreateItemTemplateModal } from './CreateItemTemplateModal';
import { flow } from '../services/flow';

export const Create = props => {
  const [ itemTemplates, setItemTemplates ] = useState([]);

  const updateItemTemplates = async () => {
    const result = await flow.getCreatedCollectibleData();
    setItemTemplates(result);
  };

  useEffect(() => {
    updateItemTemplates();
  }, []);

  return (
    <>
      <CreateItemTemplateModal updateItemTemplates={updateItemTemplates} />
      <ItemTemplateTable itemTemplates={itemTemplates} updateItemTemplates={updateItemTemplates} />
    </>
  )
}
