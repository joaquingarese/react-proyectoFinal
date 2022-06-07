import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemList from "./itemList/ItemList";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Spinner } from "react-bootstrap";

export default function ItemListContainer() {
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const db = getFirestore();
      const queryCollection = collection(db, "products");
      const queryCollectionFilter = query(
        queryCollection,
        where("category", "==", id)
      );
      getDocs(queryCollectionFilter)
        .then((resp) =>
          setItems(resp.docs.map((item) => ({ id: item.id, ...item.data() })))
        )
        .catch((err) => console.log(err))
        .finally(() => setLoader(false));
    } else {
      const db = getFirestore();
      const queryCollection = collection(db, "products");
      getDocs(queryCollection)
        .then((resp) =>
          setItems(resp.docs.map((item) => ({ id: item.id, ...item.data() })))
        )
        .catch((err) => console.log(err))
        .finally(() => setLoader(false));
    }
  }, [id]);

  return (
    <div className="m-5 mt-5 container m-auto">
      {loader ? (
        <span className="fs-5 mt-5">
          <Spinner className="me-3" animation="border" variant="secondary" />. .
          . Cargando Productos
        </span>
      ) : (
        <ItemList items={items} />
      )}
    </div>
  );
}