import axios from "axios";
import Button from "components/Common/Button";
import Image from "components/Common/Image";
import { useShoppingCart } from "contexts/ShoppingCartContext";
import { useEffect, useState } from "react";
import { IProductDetails } from "types/productsType";
import {
  addToCart,
  buildProductForCart,
  removeFromCart,
} from "utils/shoppingCart-helper";

const ShoppingCartRecommendedProducts = () => {
  const [recommendations, setRecommendations] = useState<IProductDetails[]>();
  useEffect(() => {
    axios
      .get("/api/data.json")
      .then((res) => setRecommendations(res.data.recommendations))
      .catch((err) => console.warn(err));
  }, []);

  const { state, dispatch } = useShoppingCart();
  const productsInCart = state.products;
  const [treesInCartQuantity, setTreesInCartQuantity] = useState<number>(0);
  const [plantingKitInCartQuantity, setPlantingKitInCartQuantity] =
    useState<number>(0);

  useEffect(() => {
    setTreesInCartQuantity(0);
    setPlantingKitInCartQuantity(0);

    productsInCart.forEach((item) => {
      if (item.productType === "Tree") {
        setTreesInCartQuantity((prev) => prev + (item.quantity ?? 0));
      } else if (item.title === "Tree Planting Kit") {
        setPlantingKitInCartQuantity((prev) => prev + (item.quantity ?? 0));
      }
    });
  }, [productsInCart, setTreesInCartQuantity, setPlantingKitInCartQuantity]);

  return (
    <div className="recommended-items">
      <h3 className="font-medium py-6 text-2xl">Recommended Items</h3>
      {recommendations?.map((rec) => {
        const product = buildProductForCart(rec);

        const recommendationIsInCart = productsInCart.find(
          (prod) => prod.id === rec.id
        );

        const showRecommendationAnyway =
          recommendationIsInCart?.title === "Tree Planting Kit" &&
          treesInCartQuantity > plantingKitInCartQuantity;

        return !recommendationIsInCart || showRecommendationAnyway ? (
          <div
            className="flex items-center justify-evenly py-6 px-6"
            key={product.id}
          >
            <Image
              imageUrl={rec.thumbnail.src}
              altText={rec.title}
              placeholderUrl="/images/placeholder-image.jpg"
              style={{ width: "110px" }}
              className="w-1/4 pr-3"
            />
            <p className="w-2/4 text-xl font-semibold">{rec.title}</p>
            <Button
              className="w-1/4"
              imageUrl="/images/plus-circle.svg"
              altText="Add Quantity"
              onClick={() => addToCart(product, dispatch)}
              imageStyle={{ width: "36px" }}
            />
          </div>
        ) : (
          <div className="py-3 px-6" key={product.id}>
            <div className="w-full">
              <p className="font-bold text-sm">Added to cart!</p>
              {product.title}
            </div>
            <Button
              className="text-sm text-red-600"
              onClick={() => removeFromCart(product.id, dispatch)}
            >
              Undo
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ShoppingCartRecommendedProducts;
