import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../utils/productImages';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fr-FR');
  };

  return (
    <Card className="product-card h-100">
      <Link to={`/produit/${product.id_produit}`} className="text-decoration-none text-dark">
        <Card.Img 
          variant="top" 
          src={getProductImage(product)}
          alt={product.titre}
          style={{ height: '220px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title className="text-truncate">{product.titre}</Card.Title>
          <Card.Text className="text-muted small">{product.categorie}</Card.Text>
          <Card.Text className="fw-bold text-primary">
            {formatPrice(product.prix_xaf)} FCFA
          </Card.Text>
          <Card.Text className="small text-muted">
            Stock: {product.stock} unités
          </Card.Text>
        </Card.Body>
      </Link>
      <Card.Footer className="bg-white border-top-0">
        <Button 
          variant="primary" 
          className="w-100"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;
