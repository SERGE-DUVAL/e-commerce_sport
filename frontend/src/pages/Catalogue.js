import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const Catalogue = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categorieParam = searchParams.get('categorie');

  const [filters, setFilters] = useState({
    categorie: categorieParam || '',
    recherche: '',
    prix_min: '',
    prix_max: ''
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.categorie) params.categorie = filters.categorie;
      if (filters.recherche) params.recherche = filters.recherche;
      if (filters.prix_min) params.prix_min = filters.prix_min;
      if (filters.prix_max) params.prix_max = filters.prix_max;

      const response = await productAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setFilters({
      categorie: '',
      recherche: '',
      prix_min: '',
      prix_max: ''
    });
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Catalogue</h1>

      {/* Filtres */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Catégorie</Form.Label>
                <Form.Select 
                  name="categorie" 
                  value={filters.categorie} 
                  onChange={handleFilterChange}
                >
                  <option value="">Toutes</option>
                  <option value="Football">Football</option>
                  <option value="Running">Running</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Basketball">Basketball</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Recherche</Form.Label>
                <Form.Control
                  type="text"
                  name="recherche"
                  placeholder="Nom du produit..."
                  value={filters.recherche}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Prix min (FCFA)</Form.Label>
                <Form.Control
                  type="number"
                  name="prix_min"
                  placeholder="0"
                  value={filters.prix_min}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Prix max (FCFA)</Form.Label>
                <Form.Control
                  type="number"
                  name="prix_max"
                  placeholder="Max"
                  value={filters.prix_max}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="secondary" onClick={handleReset} className="w-100">
                Réinitialiser
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Résultats */}
      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : products.length === 0 ? (
        <p className="text-center">Aucun produit trouvé</p>
      ) : (
        <>
          <p className="text-muted">{products.length} produit(s) trouvé(s)</p>
          <Row>
            {products.map((product) => (
              <Col key={product.id_produit} md={4} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Catalogue;
