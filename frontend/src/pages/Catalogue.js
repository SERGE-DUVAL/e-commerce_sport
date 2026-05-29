import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import { FaFilter, FaSearch, FaThLarge, FaList } from 'react-icons/fa';

const Catalogue = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categorieParam = searchParams.get('categorie');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('createdAt');

  const [filters, setFilters] = useState({
    categorie: categorieParam || '',
    recherche: '',
    prix_min: '',
    prix_max: ''
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.categorie) params.categorie = filters.categorie;
      if (filters.recherche) params.recherche = filters.recherche;
      if (filters.prix_min) params.prix_min = filters.prix_min;
      if (filters.prix_max) params.prix_max = filters.prix_max;
      params.sort = sortBy;

      const response = await productAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters, sortBy]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      categorie: categorieParam || ''
    }));
  }, [categorieParam]);

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

  const sortProducts = (products) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'prix_asc':
        return sorted.sort((a, b) => a.prix_xaf - b.prix_xaf);
      case 'prix_desc':
        return sorted.sort((a, b) => b.prix_xaf - a.prix_xaf);
      case 'titre':
        return sorted.sort((a, b) => a.titre.localeCompare(b.titre));
      case 'stock':
        return sorted.sort((a, b) => b.stock - a.stock);
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const sortedProducts = sortProducts(products);

  return (
    <Container className="py-5 catalogue-page" style={{ color: '#000' }}>
      <div className="catalogue-header mb-4">
        <h1 className="catalogue-title" style={{ color: '#000' }}>Catalogue</h1>
        <p className="catalogue-subtitle" style={{ color: '#000' }}>Découvrez notre sélection d'équipements sportifs premium</p>
      </div>

      {/* Filtres avancés */}
      <Card className="mb-4 filter-card" style={{ color: '#000' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0" style={{ color: '#000' }}><FaFilter /> Filtres</h5>
            <div className="d-flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <FaThLarge />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <FaList />
              </Button>
            </div>
          </div>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Catégorie</Form.Label>
                <Form.Select 
                  name="categorie" 
                  value={filters.categorie} 
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Toutes les catégories</option>
                  <option value="Football">⚽ Football</option>
                  <option value="Running">🏃 Running</option>
                  <option value="Fitness">🏋️ Fitness</option>
                  <option value="Tennis">🎾 Tennis</option>
                  <option value="Basketball">🏀 Basketball</option>
                  <option value="Natation">🏊 Natation</option>
                  <option value="Cyclisme">🚴 Cyclisme</option>
                  <option value="Boxe">🥊 Boxe</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Recherche</Form.Label>
                <div className="search-input-wrapper">
                  <Form.Control
                    type="text"
                    name="recherche"
                    placeholder="Rechercher un produit..."
                    value={filters.recherche}
                    onChange={handleFilterChange}
                    className="search-input"
                  />
                  <FaSearch className="search-icon" />
                </div>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Prix min (FCFA)</Form.Label>
                <Form.Control
                  type="number"
                  name="prix_min"
                  placeholder="0"
                  value={filters.prix_min}
                  onChange={handleFilterChange}
                  className="price-input"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Prix max (FCFA)</Form.Label>
                <Form.Control
                  type="number"
                  name="prix_max"
                  placeholder="Max"
                  value={filters.prix_max}
                  onChange={handleFilterChange}
                  className="price-input"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Trier par</Form.Label>
                <Form.Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="createdAt">Plus récents</option>
                  <option value="prix_asc">Prix croissant</option>
                  <option value="prix_desc">Prix décroissant</option>
                  <option value="titre">Alphabétique</option>
                  <option value="stock">Stock</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-between align-items-center">
            <Button variant="outline-secondary" onClick={handleReset} className="reset-btn">
              Réinitialiser les filtres
            </Button>
            <Badge bg="info" className="results-count">
              {products.length} produit(s) trouvé(s)
            </Badge>
          </div>
        </Card.Body>
      </Card>

      {/* Résultats */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="loading-spinner" />
          <p className="mt-3">Chargement des produits...</p>
        </div>
      ) : products.length === 0 ? (
        <Alert variant="info" className="no-results">
          <h5>Aucun produit trouvé</h5>
          <p>Essayez de modifier vos filtres ou votre recherche.</p>
          <Button variant="outline-primary" onClick={handleReset}>Réinitialiser les filtres</Button>
        </Alert>
      ) : (
        <>
          <Row className={viewMode === 'grid' ? 'g-4' : 'g-3'}>
            {sortedProducts.map((product) => (
              <Col 
                key={product.id_produit} 
                md={viewMode === 'grid' ? 4 : 12} 
                lg={viewMode === 'grid' ? 3 : 12}
                className="product-col"
              >
                <ProductCard product={product} viewMode={viewMode} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Catalogue;
