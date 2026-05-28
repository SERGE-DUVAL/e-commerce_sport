import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner, Table, Tab, Tabs, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaChartLine, FaDownload, FaEdit, FaFileCsv, FaFilePdf, FaPercent, FaPlus, FaShoppingCart, FaTrash, FaUsers, FaTruck, FaMapMarkerAlt, FaCloudSun, FaUndo } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { adminAPI, productAPI, stockAPI, reviewAPI } from '../services/api';
import { deliveryAPI } from '../api/delivery';
import { refundAPI } from '../api/refunds';
import { barcodeAPI } from '../api/barcode';
import { supplierAPI } from '../api/suppliers';
import { inventoryAPI } from '../api/inventory';
import { zoneAPI } from '../api/zones';
import { cashAPI } from '../api/cash';
import { creditAPI } from '../api/credits';

const emptyProduct = {
  titre: '',
  description: '',
  categorie: 'Football',
  prix_xaf: 0,
  stock: 0,
  variantes: { tailles: [], couleurs: [] }
};

const emptyPromo = {
  code: '',
  pourcentage_remise: 10,
  est_active: true,
  date_expiration: ''
};

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [stockMouvements, setStockMouvements] = useState([]);
  const [stockForecast, setStockForecast] = useState([]);
  const [deliveryReviews, setDeliveryReviews] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('adminDarkMode') === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [promoForm, setPromoForm] = useState(emptyPromo);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showLivreurModal, setShowLivreurModal] = useState(false);
  const [showEditLivreurModal, setShowEditLivreurModal] = useState(false);
  const [editingLivreur, setEditingLivreur] = useState(null);
  const [showChangeLivreurModal, setShowChangeLivreurModal] = useState(false);
  const [selectedAffectationForChange, setSelectedAffectationForChange] = useState(null);
  const [newLivreurId, setNewLivreurId] = useState('');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedProductForBarcode, setSelectedProductForBarcode] = useState(null);
  const [generatedBarcode, setGeneratedBarcode] = useState(null);
  const [generatedQRCode, setGeneratedQRCode] = useState(null);
  const [codesBarres, setCodesBarres] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [inventaires, setInventaires] = useState([]);
  const [zones, setZones] = useState([]);
  const [caisses, setCaisses] = useState([]);
  const [avoirs, setAvoirs] = useState([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [showCashModal, setShowCashModal] = useState(false);
  const [editingCash, setEditingCash] = useState(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [editingCredit, setEditingCredit] = useState(null);
  const [showClientHistoryModal, setShowClientHistoryModal] = useState(false);
  const [selectedClientHistory, setSelectedClientHistory] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    nom: '',
    contact: '',
    email: '',
    telephone: '',
    ville: '',
    adresse: ''
  });
  const [inventoryForm, setInventoryForm] = useState({
    type_inventaire: 'général',
    zone: '',
    date_debut: new Date().toISOString().split('T')[0]
  });
  const [zoneForm, setZoneForm] = useState({
    nom: '',
    type_zone: 'surface de vente',
    description: '',
    capacite: 0
  });
  const [cashForm, setCashForm] = useState({
    nom: '',
    solde_initial: 0,
    responsable_actuel: ''
  });
  const [creditForm, setCreditForm] = useState({
    numero_avoir: '',
    montant: 0,
    id_commande: ''
  });
  const [livreurForm, setLivreurForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    vehicule: 'Moto',
    plaque_immatriculation: ''
  });
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [selectedAffectation, setSelectedAffectation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [gpsData, setGpsData] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [variantSizes, setVariantSizes] = useState('');
  const [variantColors, setVariantColors] = useState('');

  // Filtres et pagination
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productSort, setProductSort] = useState('createdAt');
  const [productPage, setProductPage] = useState(1);

  const [clientSearch, setClientSearch] = useState('');
  const [clientSort, setClientSort] = useState('createdAt');
  const [clientPage, setClientPage] = useState(1);

  const [orderSort, setOrderSort] = useState('createdAt');
  const [orderPage, setOrderPage] = useState(1);
  const [orderRoleFilter, setOrderRoleFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [orderClientFilter, setOrderClientFilter] = useState('');
  const [orderProductFilter, setOrderProductFilter] = useState('');
  const [orderCategoryFilter, setOrderCategoryFilter] = useState('');

  const [globalSearch, setGlobalSearch] = useState('');
  const [livreurs, setLivreurs] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [demandesRemboursement, setDemandesRemboursement] = useState([]);

  const formatPrice = (price) => Number(price || 0).toLocaleString('fr-FR');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, ordersRes, clientsRes, promosRes, productsRes, alertsRes, mouvementsRes, forecastRes, livreursRes, affectationsRes, demandesRes, codesBarresRes, fournisseursRes, inventairesRes, zonesRes, caissesRes, avoirsRes, deliveryReviewsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllOrders(),
        adminAPI.getAllClients(),
        adminAPI.getAllPromotions(),
        productAPI.getAll(),
        stockAPI.getStockAlerts(),
        stockAPI.getMouvements(),
        stockAPI.getStockForecast(),
        deliveryAPI.getAllLivreurs(),
        deliveryAPI.getAffectations(),
        refundAPI.getAllDemandes(),
        barcodeAPI.getAllCodesBarres(),
        supplierAPI.getAllSuppliers(),
        inventoryAPI.getAllInventories(),
        zoneAPI.getAllZones(),
        cashAPI.getAllCash(),
        creditAPI.getAllCredits(),
        reviewAPI.getDeliveryReviews()
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setClients(clientsRes.data);
      setPromotions(promosRes.data);
      setProducts(productsRes.data);
      setStockAlerts(alertsRes.data);
      setStockMouvements(mouvementsRes.data);
      setStockForecast(forecastRes.data);
      setLivreurs(livreursRes.data);
      setAffectations(affectationsRes.data);
      setDemandesRemboursement(demandesRes.data);
      setCodesBarres(codesBarresRes.data);
      setFournisseurs(fournisseursRes.data);
      setInventaires(inventairesRes.data);
      setZones(zonesRes.data);
      setCaisses(caissesRes.data);
      setAvoirs(avoirsRes.data);
      setDeliveryReviews(deliveryReviewsRes.data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        setError('Accès administrateur refusé. Connectez-vous avec admin@sportequip.com / admin123.');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement du back-office.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApproveRefund = async (id) => {
    try {
      const montant = prompt('Montant du remboursement (FCFA):');
      const notes = prompt('Notes administrateur:');
      await refundAPI.approveDemande(id, { montant_rembourse: Number(montant), notes_admin: notes });
      loadData();
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const handleRejectRefund = async (id) => {
    try {
      const notes = prompt('Motif du refus:');
      await refundAPI.rejectDemande(id, { notes_admin: notes });
      loadData();
    } catch (error) {
      console.error('Erreur lors du refus:', error);
    }
  };

  const handleCreateLivreur = async () => {
    try {
      await deliveryAPI.createLivreur(livreurForm);
      setShowLivreurModal(false);
      setLivreurForm({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        vehicule: 'Moto',
        plaque_immatriculation: ''
      });
      loadData();
    } catch (error) {
      console.error('Erreur lors de la création du livreur:', error);
    }
  };

  const handleEditLivreur = (livreur) => {
    setEditingLivreur(livreur);
    setLivreurForm({
      nom: livreur.nom,
      prenom: livreur.prenom,
      telephone: livreur.telephone,
      email: livreur.email,
      vehicule: livreur.vehicule,
      plaque_immatriculation: livreur.plaque_immatriculation
    });
    setShowEditLivreurModal(true);
  };

  const handleUpdateLivreur = async () => {
    try {
      await deliveryAPI.updateLivreur(editingLivreur.id_livreur, livreurForm);
      setShowEditLivreurModal(false);
      setEditingLivreur(null);
      setLivreurForm({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        vehicule: 'Moto',
        plaque_immatriculation: ''
      });
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification du livreur:', error);
    }
  };

  const handleDeleteLivreur = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) {
      try {
        await deliveryAPI.deleteLivreur(id);
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression du livreur:', error);
      }
    }
  };

  const handleChangeLivreur = (affectation) => {
    setSelectedAffectationForChange(affectation);
    setNewLivreurId('');
    setShowChangeLivreurModal(true);
  };

  const handleConfirmChangeLivreur = async () => {
    try {
      // Libérer l'ancien livreur
      const oldLivreur = livreurs.find(l => l.id_livreur === selectedAffectationForChange.id_livreur);
      if (oldLivreur) {
        await deliveryAPI.updateLivreur(oldLivreur.id_livreur, { statut: 'disponible' });
      }

      // Mettre à jour l'affectation avec le nouveau livreur
      await deliveryAPI.updateAffectationStatus(selectedAffectationForChange.id_affectation, {
        id_livreur: newLivreurId
      });

      // Mettre le nouveau livreur en livraison
      const newLivreur = livreurs.find(l => l.id_livreur === parseInt(newLivreurId));
      if (newLivreur) {
        await deliveryAPI.updateLivreur(newLivreur.id_livreur, { statut: 'en livraison' });
      }

      setShowChangeLivreurModal(false);
      setSelectedAffectationForChange(null);
      setNewLivreurId('');
      loadData();
    } catch (error) {
      console.error('Erreur lors du changement de livreur:', error);
    }
  };

  const handleGenerateBarcode = async (product) => {
    try {
      setSelectedProductForBarcode(product);
      const response = await barcodeAPI.generateEAN13({ id_produit: product.id_produit });
      setGeneratedBarcode(response.data.code_barre);
      setGeneratedQRCode(null);
      setShowBarcodeModal(true);
    } catch (error) {
      console.error('Erreur lors de la génération du code-barres:', error);
    }
  };

  const handleGenerateQRCode = async (product) => {
    try {
      setSelectedProductForBarcode(product);
      const response = await barcodeAPI.generateQRCode({
        id_produit: product.id_produit,
        data: JSON.stringify({
          produit: product.id_produit,
          titre: product.titre,
          prix: product.prix_xaf
        })
      });
      setGeneratedQRCode(response.data.qr_code);
      setGeneratedBarcode(null);
      setShowBarcodeModal(true);
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
    }
  };

  const handleSaveBarcode = async () => {
    try {
      if (generatedBarcode) {
        await barcodeAPI.createCodeBarre({
          id_produit: selectedProductForBarcode.id_produit,
          code_barre: generatedBarcode,
          type_code: 'EAN13'
        });
      } else if (generatedQRCode) {
        await barcodeAPI.createCodeBarre({
          id_produit: selectedProductForBarcode.id_produit,
          code_barre: `QR-${selectedProductForBarcode.id_produit}-${Date.now()}`,
          type_code: 'QR',
          qr_code_data: generatedQRCode
        });
      }
      setShowBarcodeModal(false);
      setGeneratedBarcode(null);
      setGeneratedQRCode(null);
      setSelectedProductForBarcode(null);
      loadCodesBarres();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du code-barres:', error);
    }
  };

  const loadCodesBarres = async () => {
    try {
      const response = await barcodeAPI.getAllCodesBarres();
      setCodesBarres(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des codes-barres:', error);
    }
  };

  const handleToggleBarcode = async (id) => {
    try {
      await barcodeAPI.toggleCodeBarre(id);
      loadCodesBarres();
    } catch (error) {
      console.error('Erreur lors de la modification du code-barres:', error);
    }
  };

  const handleDeleteBarcode = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce code-barres ?')) {
      try {
        await barcodeAPI.deleteCodeBarre(id);
        loadCodesBarres();
      } catch (error) {
        console.error('Erreur lors de la suppression du code-barres:', error);
      }
    }
  };

  const loadFournisseurs = async () => {
    try {
      const response = await supplierAPI.getAllSuppliers();
      setFournisseurs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error);
    }
  };

  const loadInventaires = async () => {
    try {
      const response = await inventoryAPI.getAllInventories();
      setInventaires(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des inventaires:', error);
    }
  };

  const loadZones = async () => {
    try {
      const response = await zoneAPI.getAllZones();
      setZones(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des zones:', error);
    }
  };

  const loadCaisses = async () => {
    try {
      const response = await cashAPI.getAllCash();
      setCaisses(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des caisses:', error);
    }
  };

  const loadAvoirs = async () => {
    try {
      const response = await creditAPI.getAllCredits();
      setAvoirs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des avoirs:', error);
    }
  };

  // Fonctions pour les fournisseurs
  const openCreateSupplier = () => {
    setEditingSupplier(null);
    setSupplierForm({
      nom: '',
      contact: '',
      email: '',
      telephone: '',
      ville: '',
      adresse: ''
    });
    setShowSupplierModal(true);
  };

  const openEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      nom: supplier.nom,
      contact: supplier.contact || '',
      email: supplier.email || '',
      telephone: supplier.telephone || '',
      ville: supplier.ville || '',
      adresse: supplier.adresse || ''
    });
    setShowSupplierModal(true);
  };

  const submitSupplier = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await supplierAPI.updateSupplier(editingSupplier.id_fournisseur, supplierForm);
      } else {
        await supplierAPI.createSupplier(supplierForm);
      }
      setShowSupplierModal(false);
      loadFournisseurs();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fournisseur:', error);
    }
  };

  const deleteSupplier = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      try {
        await supplierAPI.deleteSupplier(id);
        loadFournisseurs();
      } catch (error) {
        console.error('Erreur lors de la suppression du fournisseur:', error);
      }
    }
  };

  const toggleSupplier = async (id) => {
    try {
      await supplierAPI.toggleSupplier(id);
      loadFournisseurs();
    } catch (error) {
      console.error('Erreur lors de la modification du fournisseur:', error);
    }
  };

  // Fonctions pour les inventaires
  const openCreateInventory = () => {
    setEditingInventory(null);
    setInventoryForm({
      type_inventaire: 'général',
      zone: '',
      date_debut: new Date().toISOString().split('T')[0]
    });
    setShowInventoryModal(true);
  };

  const openEditInventory = (inventory) => {
    setEditingInventory(inventory);
    setInventoryForm({
      type_inventaire: inventory.type_inventaire,
      zone: inventory.zone || '',
      date_debut: inventory.date_debut.split('T')[0]
    });
    setShowInventoryModal(true);
  };

  const submitInventory = async (e) => {
    e.preventDefault();
    try {
      if (editingInventory) {
        await inventoryAPI.updateInventory(editingInventory.id_inventaire, inventoryForm);
      } else {
        await inventoryAPI.createInventory(inventoryForm);
      }
      setShowInventoryModal(false);
      loadInventaires();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'inventaire:', error);
    }
  };

  const deleteInventory = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet inventaire ?')) {
      try {
        await inventoryAPI.deleteInventory(id);
        loadInventaires();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'inventaire:', error);
      }
    }
  };

  // Fonctions pour les zones
  const openCreateZone = () => {
    setEditingZone(null);
    setZoneForm({
      nom: '',
      type_zone: 'surface de vente',
      description: '',
      capacite: 0
    });
    setShowZoneModal(true);
  };

  const openEditZone = (zone) => {
    setEditingZone(zone);
    setZoneForm({
      nom: zone.nom,
      type_zone: zone.type_zone,
      description: zone.description || '',
      capacite: zone.capacite
    });
    setShowZoneModal(true);
  };

  const submitZone = async (e) => {
    e.preventDefault();
    try {
      if (editingZone) {
        await zoneAPI.updateZone(editingZone.id_zone, zoneForm);
      } else {
        await zoneAPI.createZone(zoneForm);
      }
      setShowZoneModal(false);
      loadZones();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la zone:', error);
    }
  };

  const deleteZone = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
      try {
        await zoneAPI.deleteZone(id);
        loadZones();
      } catch (error) {
        console.error('Erreur lors de la suppression de la zone:', error);
      }
    }
  };

  const toggleZone = async (id) => {
    try {
      await zoneAPI.toggleZone(id);
      loadZones();
    } catch (error) {
      console.error('Erreur lors de la modification de la zone:', error);
    }
  };

  // Fonctions pour les caisses
  const openCreateCash = () => {
    setEditingCash(null);
    setCashForm({
      nom: '',
      solde_initial: 0,
      responsable_actuel: ''
    });
    setShowCashModal(true);
  };

  const openEditCash = (cash) => {
    setEditingCash(cash);
    setCashForm({
      nom: cash.nom,
      solde_initial: cash.solde_initial,
      responsable_actuel: cash.responsable_actuel || ''
    });
    setShowCashModal(true);
  };

  const submitCash = async (e) => {
    e.preventDefault();
    try {
      if (editingCash) {
        await cashAPI.updateCash(editingCash.id_caisse, cashForm);
      } else {
        await cashAPI.createCash(cashForm);
      }
      setShowCashModal(false);
      loadCaisses();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la caisse:', error);
    }
  };

  const deleteCash = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette caisse ?')) {
      try {
        await cashAPI.deleteCash(id);
        loadCaisses();
      } catch (error) {
        console.error('Erreur lors de la suppression de la caisse:', error);
      }
    }
  };

  const closeCash = async (id) => {
    try {
      await cashAPI.closeCash(id);
      loadCaisses();
    } catch (error) {
      console.error('Erreur lors de la fermeture de la caisse:', error);
    }
  };

  const openCash = async (id) => {
    try {
      await cashAPI.openCash(id);
      loadCaisses();
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la caisse:', error);
    }
  };

  // Fonctions pour les avoirs
  const openCreateCredit = () => {
    setEditingCredit(null);
    setCreditForm({
      numero_avoir: '',
      montant: 0,
      id_commande: ''
    });
    setShowCreditModal(true);
  };

  const openEditCredit = (credit) => {
    setEditingCredit(credit);
    setCreditForm({
      numero_avoir: credit.numero_avoir,
      montant: credit.montant,
      id_commande: credit.id_commande || ''
    });
    setShowCreditModal(true);
  };

  const submitCredit = async (e) => {
    e.preventDefault();
    try {
      if (editingCredit) {
        await creditAPI.updateCredit(editingCredit.id_avoir, creditForm);
      } else {
        await creditAPI.createCredit(creditForm);
      }
      setShowCreditModal(false);
      loadAvoirs();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'avoir:', error);
    }
  };

  const deleteCredit = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet avoir ?')) {
      try {
        await creditAPI.deleteCredit(id);
        loadAvoirs();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'avoir:', error);
      }
    }
  };

  const applyCredit = async (id) => {
    try {
      await creditAPI.useCredit(id);
      loadAvoirs();
    } catch (error) {
      console.error('Erreur lors de l\'utilisation de l\'avoir:', error);
    }
  };

  const viewClientHistory = async (client) => {
    try {
      // Charger l'historique complet du client (commandes, avis, etc.)
      const userOrders = await adminAPI.getUserOrders(client.id_utilisateur);
      setSelectedClientHistory({
        client,
        orders: userOrders.data || []
      });
      setShowClientHistoryModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const handleViewWeather = async (affectation) => {
    try {
      setSelectedAffectation(affectation);
      const livreur = livreurs.find(l => l.id_livreur === affectation.id_livreur);
      if (livreur && livreur.latitude && livreur.longitude) {
        const response = await deliveryAPI.getWeather(livreur.latitude, livreur.longitude);
        setWeatherData(response.data);
        setShowWeatherModal(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la météo:', error);
    }
  };

  const handleViewGPS = async (affectation) => {
    try {
      setSelectedAffectation(affectation);
      const livreur = livreurs.find(l => l.id_livreur === affectation.id_livreur);
      if (livreur && livreur.latitude && livreur.longitude) {
        setGpsData({
          latitude: livreur.latitude,
          longitude: livreur.longitude,
          derniere_mise_a_jour: livreur.derniere_mise_a_jour_gps
        });
        setShowWeatherModal(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du GPS:', error);
    }
  };

  const handleMarkAsTraitee = async (id) => {
    try {
      await refundAPI.markAsTraitee(id);
      loadData();
    } catch (error) {
      console.error('Erreur lors du marquage comme traité:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('adminDarkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError('Session absente. Connectez-vous avec un compte administrateur.');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate, loadData]);

  const dashboardMetrics = useMemo(() => {
    const revenue = Number(stats?.totalRevenus || 0);
    const paidOrders = Number(stats?.totalCommandes || 0);
    const stock = Number(stats?.produitsEnStock || 0);
    const sold = Number(stats?.produitsVendus || 0);
    const averageCart = paidOrders > 0 ? Math.round(revenue / paidOrders) : 0;

    return [
      { label: 'Revenus validés', value: `${formatPrice(revenue)} FCFA`, icon: <FaChartLine />, tone: 'primary' },
      { label: 'Commandes payées', value: paidOrders, icon: <FaShoppingCart />, tone: 'success' },
      { label: 'Clients inscrits', value: Number(stats?.totalClients || 0), icon: <FaUsers />, tone: 'info' },
      { label: 'Stock total', value: stock, icon: <FaBoxOpen />, tone: 'warning' },
      { label: 'Produits vendus', value: sold, icon: <FaDownload />, tone: 'danger' },
      { label: 'Panier moyen', value: `${formatPrice(averageCart)} FCFA`, icon: <FaPercent />, tone: 'dark' }
    ];
  }, [stats]);

  const maxDailySale = Math.max(...(stats?.ventesParJour || []).map((sale) => Number(sale.total || 0)), 1);

  // Filtres et tri produits
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    if (productSearch) {
      const search = productSearch.toLowerCase();
      filtered = filtered.filter(p => 
        p.titre.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.categorie.toLowerCase().includes(search)
      );
    }
    
    if (productCategory) {
      filtered = filtered.filter(p => p.categorie === productCategory);
    }

    filtered.sort((a, b) => {
      if (productSort === 'titre') return a.titre.localeCompare(b.titre);
      if (productSort === 'categorie') return a.categorie.localeCompare(b.categorie);
      if (productSort === 'prix') return b.prix_xaf - a.prix_xaf;
      if (productSort === 'stock') return b.stock - a.stock;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return filtered;
  }, [products, productSearch, productCategory, productSort]);

  const productCount = filteredProducts.length;
  const productTotalPages = Math.ceil(productCount / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((productPage - 1) * ITEMS_PER_PAGE, productPage * ITEMS_PER_PAGE);

  // Filtres et tri clients
  const filteredClients = useMemo(() => {
    let filtered = [...clients];
    
    if (clientSearch) {
      const search = clientSearch.toLowerCase();
      filtered = filtered.filter(c => 
        c.nom.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => {
      if (clientSort === 'nom') return a.nom.localeCompare(b.nom);
      if (clientSort === 'points') return b.points_fidelite - a.points_fidelite;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return filtered;
  }, [clients, clientSearch, clientSort]);

  const clientCount = filteredClients.length;
  const clientTotalPages = Math.ceil(clientCount / ITEMS_PER_PAGE);
  const paginatedClients = filteredClients.slice((clientPage - 1) * ITEMS_PER_PAGE, clientPage * ITEMS_PER_PAGE);

  // Tri commandes
  const sortedOrders = useMemo(() => {
    let sorted = [...orders];
    
    if (orderRoleFilter) {
      sorted = sorted.filter(order => order.Utilisateur?.role === orderRoleFilter);
    }

    if (orderStatusFilter) {
      sorted = sorted.filter(order => order.statut === orderStatusFilter);
    }

    if (orderClientFilter) {
      const search = orderClientFilter.toLowerCase();
      sorted = sorted.filter(order =>
        order.Utilisateur?.nom?.toLowerCase().includes(search) ||
        order.Utilisateur?.email?.toLowerCase().includes(search)
      );
    }

    if (orderProductFilter) {
      const search = orderProductFilter.toLowerCase();
      sorted = sorted.filter(order =>
        order.LigneCommandes?.some(line => line.Produit?.titre?.toLowerCase().includes(search))
      );
    }

    if (orderCategoryFilter) {
      sorted = sorted.filter(order =>
        order.LigneCommandes?.some(line => line.Produit?.categorie === orderCategoryFilter)
      );
    }
    
    sorted.sort((a, b) => {
      if (orderSort === 'total') return b.total_xaf - a.total_xaf;
      if (orderSort === 'statut') return a.statut.localeCompare(b.statut);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return sorted;
  }, [orders, orderSort, orderRoleFilter, orderStatusFilter, orderClientFilter, orderProductFilter, orderCategoryFilter]);

  const orderCount = sortedOrders.length;
  const orderTotalPages = Math.ceil(orderCount / ITEMS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice((orderPage - 1) * ITEMS_PER_PAGE, orderPage * ITEMS_PER_PAGE);

  // Recherche globale
  const globalSearchResults = useMemo(() => {
    if (!globalSearch) return null;

    const search = globalSearch.toLowerCase();
    const results = {
      orders: orders.filter(order =>
        order.id_commande.toString().includes(search) ||
        order.Utilisateur?.email?.toLowerCase().includes(search) ||
        order.Utilisateur?.nom?.toLowerCase().includes(search)
      ),
      clients: clients.filter(client =>
        client.email.toLowerCase().includes(search) ||
        client.nom.toLowerCase().includes(search)
      ),
      products: products.filter(product =>
        product.titre.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.categorie.toLowerCase().includes(search)
      )
    };

    return results;
  }, [globalSearch, orders, clients, products]);

  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setVariantSizes('');
    setVariantColors('');
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    const variantes = typeof product.variantes === 'string' ? JSON.parse(product.variantes || '{}') : product.variantes || {};
    setEditingProduct(product);
    setProductForm({ ...product, variantes });
    setVariantSizes((variantes.tailles || []).join(', '));
    setVariantColors((variantes.couleurs || []).join(', '));
    setShowProductModal(true);
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      prix_xaf: Number(productForm.prix_xaf),
      stock: Number(productForm.stock),
      variantes: {
        tailles: variantSizes.split(',').map((item) => item.trim()).filter(Boolean),
        couleurs: variantColors.split(',').map((item) => item.trim()).filter(Boolean)
      }
    };

    try {
      if (editingProduct) {
        const updated = await productAPI.update(editingProduct.id_produit, payload);
        setProducts(prev => prev.map(p => p.id_produit === editingProduct.id_produit ? updated.data : p));
      } else {
        const created = await productAPI.create(payload);
        setProducts(prev => [created.data, ...prev]);
      }
      setShowProductModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l’enregistrement du produit');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Supprimer définitivement ce produit ?')) return;
    try {
      await productAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id_produit !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression du produit');
    }
  };

  const deleteClient = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      await adminAPI.deleteClient(id);
      setClients(prev => prev.filter(c => c.id_utilisateur !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression du client');
    }
  };

  const openCreatePromo = () => {
    setEditingPromo(null);
    setPromoForm(emptyPromo);
    setShowPromoModal(true);
  };

  const openEditPromo = (promo) => {
    setEditingPromo(promo);
    setPromoForm({
      code: promo.code,
      pourcentage_remise: promo.pourcentage_remise,
      est_active: promo.est_active,
      date_expiration: promo.date_expiration?.slice(0, 10) || ''
    });
    setShowPromoModal(true);
  };

  const submitPromo = async (e) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        const updated = await adminAPI.updatePromotion(editingPromo.id_promotion, promoForm);
        setPromotions(prev => prev.map(p => p.id_promotion === editingPromo.id_promotion ? updated.data : p));
      } else {
        const created = await adminAPI.createPromotion(promoForm);
        setPromotions(prev => [created.data, ...prev]);
      }
      setShowPromoModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l’enregistrement de la promotion');
    }
  };

  const togglePromo = async (promo) => {
    try {
      const updated = await adminAPI.updatePromotion(promo.id_promotion, { ...promo, est_active: !promo.est_active });
      setPromotions(prev => prev.map(p => p.id_promotion === promo.id_promotion ? updated.data : p));
    } catch (err) {
      alert('Erreur lors du changement de statut');
    }
  };

  const deletePromo = async (id) => {
    if (!window.confirm('Supprimer cette promotion ?')) return;
    try {
      await adminAPI.deletePromotion(id);
      setPromotions(prev => prev.filter(p => p.id_promotion !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const updateOrderStatus = async (orderId, statut) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { statut });
      setOrders(prev => prev.map(o => o.id_commande === orderId ? { ...o, statut } : o));
    } catch (err) {
      alert('Erreur lors de la mise à jour de la commande');
    }
  };

  const downloadFile = async (type) => {
    try {
      const response = type === 'pdf' ? await adminAPI.exportPDF() : await adminAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = type === 'pdf' ? 'rapport_ventes.pdf' : 'ventes.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Erreur lors de l’export ${type.toUpperCase()}`);
    }
  };

  if (loading) {
    return (
      <Container className="admin-page py-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="text-white mt-3">Chargement du back-office...</p>
      </Container>
    );
  }

  return (
    <Container className={`admin-page py-4 ${darkMode ? 'admin-dark-mode' : ''}`}>
      <section className="admin-hero mb-4">
        <div>
          <Badge bg="warning" text="dark" className="mb-2">Administration sécurisée</Badge>
          <h1>Back-Office Administrateur</h1>
          <p>Vue complète de la base de données, pilotage des commandes, clients, promotions et catalogue.</p>
        </div>
        <div className="admin-hero-actions">
          <Form.Control
            type="text"
            placeholder="Rechercher (commande, email, produit...)"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <Button variant={darkMode ? "light" : "dark"} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </Button>
          <Button variant="light" onClick={loadData}>Actualiser</Button>
          <Button variant="success" onClick={() => downloadFile('csv')}><FaFileCsv /> CSV</Button>
          <Button variant="danger" onClick={() => downloadFile('pdf')}><FaFilePdf /> PDF</Button>
        </div>
      </section>

      {error && <Alert variant="danger">{error}</Alert>}

      {globalSearchResults && (
        <Row className="g-3 mb-4">
          <Col lg={12}>
            <Card className="admin-panel">
              <Card.Body>
                <h4>Résultats de recherche pour "{globalSearch}"</h4>
                <Row className="g-3">
                  {globalSearchResults.orders.length > 0 && (
                    <Col lg={4}>
                      <h5>Commandes ({globalSearchResults.orders.length})</h5>
                      <Table responsive size="sm" className="admin-table">
                        <thead><tr><th>#</th><th>Client</th><th>Total</th><th>Statut</th></tr></thead>
                        <tbody>
                          {globalSearchResults.orders.slice(0, 5).map((order) => (
                            <tr key={order.id_commande}>
                              <td>{order.id_commande}</td>
                              <td>{order.Utilisateur?.nom || '-'}</td>
                              <td>{formatPrice(order.total_xaf)} FCFA</td>
                              <td><Badge bg={order.statut === 'Livrée' ? 'success' : order.statut === 'Payée' ? 'primary' : 'warning'}>{order.statut}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  )}
                  {globalSearchResults.clients.length > 0 && (
                    <Col lg={4}>
                      <h5>Clients ({globalSearchResults.clients.length})</h5>
                      <Table responsive size="sm" className="admin-table">
                        <thead><tr><th>Nom</th><th>Email</th><th>Points</th></tr></thead>
                        <tbody>
                          {globalSearchResults.clients.slice(0, 5).map((client) => (
                            <tr key={client.id_utilisateur}>
                              <td>{client.nom}</td>
                              <td>{client.email}</td>
                              <td><Badge bg="warning">{client.points_fidelite}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  )}
                  {globalSearchResults.products.length > 0 && (
                    <Col lg={4}>
                      <h5>Produits ({globalSearchResults.products.length})</h5>
                      <Table responsive size="sm" className="admin-table">
                        <thead><tr><th>Produit</th><th>Domaine</th><th>Prix</th></tr></thead>
                        <tbody>
                          {globalSearchResults.products.slice(0, 5).map((product) => (
                            <tr key={product.id_produit}>
                              <td>{product.titre}</td>
                              <td><Badge bg="info">{product.categorie}</Badge></td>
                              <td>{formatPrice(product.prix_xaf)} FCFA</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  )}
                </Row>
                {globalSearchResults.orders.length === 0 && globalSearchResults.clients.length === 0 && globalSearchResults.products.length === 0 && (
                  <p className="text-muted">Aucun résultat trouvé</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="g-3 mb-4">
        {dashboardMetrics.map((metric) => (
          <Col lg={4} md={6} key={metric.label}>
            <Card className={`admin-stat-card admin-stat-${metric.tone}`}>
              <Card.Body>
                <span className="admin-stat-icon">{metric.icon}</span>
                <div>
                  <h3>{metric.value}</h3>
                  <p>{metric.label}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {stockAlerts.length > 0 && (
        <Row className="g-3 mb-4">
          <Col lg={12}>
            <Alert variant="danger" className="admin-stock-alert">
              <Alert.Heading>⚠️ Alertes de stock bas</Alert.Heading>
              <Table responsive size="sm" className="mb-0">
                <thead><tr><th>Produit</th><th>Domaine</th><th>Stock actuel</th><th>Prix</th></tr></thead>
                <tbody>
                  {stockAlerts.map((alert) => (
                    <tr key={alert.id_produit}>
                      <td><strong>{alert.titre}</strong></td>
                      <td><Badge bg="warning">{alert.categorie}</Badge></td>
                      <td><Badge bg="danger">{alert.stock}</Badge></td>
                      <td>{formatPrice(alert.prix_xaf)} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="g-3 mb-4">
        <Col lg={7}>
          <Card className="admin-panel h-100">
            <Card.Body>
              <h4>Évolution des ventes sur 30 jours</h4>
              <div className="admin-sales-chart">
                {(stats?.ventesParJour || []).length === 0 && <p className="text-muted">Aucune vente payée sur la période.</p>}
                {(stats?.ventesParJour || []).map((sale) => {
                  const height = `${Math.max((Number(sale.total) / maxDailySale) * 180, 8)}px`;
                  return (
                    <div className="admin-sales-column" key={sale.date}>
                      <span style={{ height }} title={`${formatPrice(sale.total)} FCFA`} />
                      <small>{new Date(sale.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</small>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="admin-panel h-100">
            <Card.Body>
              <h4>Top 5 produits les plus vendus</h4>
              {stats?.topProduits?.length > 0 ? (
                <Table responsive size="sm" className="admin-table mb-3">
                  <thead><tr><th>Produit</th><th>Domaine</th><th>Quantité vendue</th></tr></thead>
                  <tbody>
                    {stats.topProduits.map((produit) => (
                      <tr key={produit.id_produit}>
                        <td><strong>{produit.titre}</strong></td>
                        <td><Badge bg="info">{produit.categorie}</Badge></td>
                        <td><Badge bg="success">{produit.total_vendu}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mb-3">Aucune vente enregistrée</p>
              )}
              <hr />
              <h4>Top 5 clients les plus fidèles</h4>
              {stats?.topClients?.length > 0 ? (
                <Table responsive size="sm" className="admin-table">
                  <thead><tr><th>Client</th><th>Email</th><th>Points fidélité</th></tr></thead>
                  <tbody>
                    {stats.topClients.map((client) => (
                      <tr key={client.id_utilisateur}>
                        <td><strong>{client.nom}</strong></td>
                        <td>{client.email}</td>
                        <td><Badge bg="warning">{client.points_fidelite}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">Aucun client inscrit</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="commandes" className="admin-tabs mb-3">
        <Tab eventKey="commandes" title={`Commandes (${orderCount})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Commandes de la base de données</h4>
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  <Form.Control size="sm" placeholder="Client/email..." value={orderClientFilter} onChange={(e) => { setOrderClientFilter(e.target.value); setOrderPage(1); }} style={{ maxWidth: '160px' }} />
                  <Form.Control size="sm" placeholder="Produit..." value={orderProductFilter} onChange={(e) => { setOrderProductFilter(e.target.value); setOrderPage(1); }} style={{ maxWidth: '150px' }} />
                  <Form.Select size="sm" value={orderCategoryFilter} onChange={(e) => { setOrderCategoryFilter(e.target.value); setOrderPage(1); }} style={{ maxWidth: '150px' }}>
                    <option value="">Tous domaines</option>
                    <option>Football</option>
                    <option>Running</option>
                    <option>Fitness</option>
                    <option>Tennis</option>
                    <option>Basketball</option>
                  </Form.Select>
                  <Form.Select size="sm" value={orderStatusFilter} onChange={(e) => { setOrderStatusFilter(e.target.value); setOrderPage(1); }} style={{ maxWidth: '150px' }}>
                    <option value="">Tous statuts</option>
                    <option>En attente</option>
                    <option>Payée</option>
                    <option>En livraison</option>
                    <option>Livrée</option>
                    <option>Annulée</option>
                  </Form.Select>
                  <Form.Select size="sm" value={orderRoleFilter} onChange={(e) => { setOrderRoleFilter(e.target.value); setOrderPage(1); }} style={{ maxWidth: '150px' }}>
                    <option value="">Tous les rôles</option>
                    <option value="client">Clients</option>
                    <option value="admin">Administrateurs</option>
                  </Form.Select>
                  <Form.Select size="sm" value={orderSort} onChange={(e) => { setOrderSort(e.target.value); setOrderPage(1); }}>
                    <option value="createdAt">Par date</option>
                    <option value="total">Par montant</option>
                    <option value="statut">Par statut</option>
                  </Form.Select>
                  <Button variant="outline-success" onClick={() => downloadFile('csv')}><FaFileCsv /> Export CSV</Button>
                  <Button variant="outline-danger" onClick={() => downloadFile('pdf')}><FaFilePdf /> Export PDF</Button>
                </div>
              </div>
              <Table responsive hover className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Client</th><th>Email</th><th>Rôle</th><th>Date</th><th>Total</th><th>Livraison</th><th>Paiement</th><th>Articles</th><th>Statut</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id_commande}>
                      <td>{order.id_commande}</td>
                      <td>{order.Utilisateur?.nom || '-'}</td>
                      <td>{order.Utilisateur?.email || '-'}</td>
                      <td><Badge bg={order.Utilisateur?.role === 'admin' ? 'danger' : 'info'}>{order.Utilisateur?.role || '-'}</Badge></td>
                      <td>{new Date(order.createdAt).toLocaleString('fr-FR')}</td>
                      <td>{formatPrice(order.total_xaf)} FCFA</td>
                      <td>{formatPrice(order.frais_livraison)} FCFA</td>
                      <td>{order.moyen_paiement}</td>
                      <td>{order.LigneCommandes?.reduce((sum, line) => sum + Number(line.quantite || 0), 0) || 0}</td>
                      <td><Badge bg={order.statut === 'Livrée' ? 'success' : order.statut === 'En livraison' ? 'info' : order.statut === 'Payée' ? 'primary' : order.statut === 'Annulée' ? 'danger' : 'warning'}>{order.statut}</Badge></td>
                      <td>
                        <Form.Select size="sm" value={order.statut} onChange={(e) => updateOrderStatus(order.id_commande, e.target.value)}>
                          <option value="En attente">En attente</option>
                          <option value="Payée">Payée</option>
                          <option value="En livraison">En livraison</option>
                          <option value="Livrée">Livrée</option>
                          <option value="Annulée">Annulée</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {orderTotalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First onClick={() => setOrderPage(1)} disabled={orderPage === 1} />
                  <Pagination.Prev onClick={() => setOrderPage(p => Math.max(1, p - 1))} disabled={orderPage === 1} />
                  {[...Array(orderTotalPages)].map((_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === orderPage} onClick={() => setOrderPage(i + 1)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setOrderPage(p => Math.min(orderTotalPages, p + 1))} disabled={orderPage === orderTotalPages} />
                  <Pagination.Last onClick={() => setOrderPage(orderTotalPages)} disabled={orderPage === orderTotalPages} />
                </Pagination>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="clients" title={`Clients (${clientCount})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Clients inscrits</h4>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Control size="sm" placeholder="Rechercher nom/email..." value={clientSearch} onChange={(e) => { setClientSearch(e.target.value); setClientPage(1); }} style={{ maxWidth: '200px' }} />
                  <Form.Select size="sm" value={clientSort} onChange={(e) => { setClientSort(e.target.value); setClientPage(1); }}>
                    <option value="createdAt">Par date</option>
                    <option value="nom">Par nom</option>
                    <option value="points">Par points</option>
                  </Form.Select>
                </div>
              </div>
              <Table responsive hover className="admin-table">
                <thead><tr><th>ID</th><th>Nom</th><th>Email</th><th>Points</th><th>Adresse</th><th>Inscription</th><th>Actions</th></tr></thead>
                <tbody>
                  {paginatedClients.map((client) => (
                    <tr key={client.id_utilisateur}>
                      <td>{client.id_utilisateur}</td>
                      <td>{client.nom}</td>
                      <td>{client.email}</td>
                      <td><Badge bg="success">{client.points_fidelite}</Badge></td>
                      <td>{client.adresse_livraison || '-'}</td>
                      <td>{new Date(client.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <Button size="sm" variant="outline-info" className="me-1" onClick={() => viewClientHistory(client)}><FaChartLine /></Button>
                        <Button size="sm" variant="outline-danger" onClick={() => deleteClient(client.id_utilisateur)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {clientTotalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First onClick={() => setClientPage(1)} disabled={clientPage === 1} />
                  <Pagination.Prev onClick={() => setClientPage(p => Math.max(1, p - 1))} disabled={clientPage === 1} />
                  {[...Array(clientTotalPages)].map((_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === clientPage} onClick={() => setClientPage(i + 1)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setClientPage(p => Math.min(clientTotalPages, p + 1))} disabled={clientPage === clientTotalPages} />
                  <Pagination.Last onClick={() => setClientPage(clientTotalPages)} disabled={clientPage === clientTotalPages} />
                </Pagination>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="promotions" title={`Promotions (${promotions.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Promotions administrateur</h4>
                <Button variant="primary" onClick={openCreatePromo}><FaPlus /> Nouvelle promotion</Button>
              </div>
              <Table responsive hover className="admin-table">
                <thead><tr><th>Code</th><th>Remise</th><th>Expiration</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {promotions.map((promo) => (
                    <tr key={promo.id_promotion}>
                      <td><strong>{promo.code}</strong></td>
                      <td>{promo.pourcentage_remise}%</td>
                      <td>{new Date(promo.date_expiration).toLocaleDateString('fr-FR')}</td>
                      <td><Badge bg={promo.est_active ? 'success' : 'secondary'}>{promo.est_active ? 'Active' : 'Inactive'}</Badge></td>
                      <td className="admin-actions">
                        <Button size="sm" variant={promo.est_active ? 'outline-secondary' : 'outline-success'} onClick={() => togglePromo(promo)}>{promo.est_active ? 'Désactiver' : 'Activer'}</Button>
                        <Button size="sm" variant="outline-primary" onClick={() => openEditPromo(promo)}><FaEdit /></Button>
                        <Button size="sm" variant="outline-danger" onClick={() => deletePromo(promo.id_promotion)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="produits" title={`Produits (${productCount})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Catalogue complet</h4>
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  <Form.Control size="sm" placeholder="Rechercher mots-clés..." value={productSearch} onChange={(e) => { setProductSearch(e.target.value); setProductPage(1); }} style={{ maxWidth: '220px' }} />
                  <Form.Select size="sm" value={productCategory} onChange={(e) => { setProductCategory(e.target.value); setProductPage(1); }} style={{ maxWidth: '150px' }}>
                    <option value="">Tous domaines</option>
                    <option>Football</option>
                    <option>Running</option>
                    <option>Fitness</option>
                    <option>Tennis</option>
                    <option>Basketball</option>
                    <option>Natation</option>
                    <option>Cyclisme</option>
                    <option>Boxe</option>
                  </Form.Select>
                  <Form.Select size="sm" value={productSort} onChange={(e) => { setProductSort(e.target.value); setProductPage(1); }} style={{ maxWidth: '150px' }}>
                    <option value="createdAt">Par date</option>
                    <option value="titre">Alphabétique</option>
                    <option value="categorie">Par domaine</option>
                    <option value="prix">Par prix</option>
                    <option value="stock">Par stock</option>
                  </Form.Select>
                  <Button variant="primary" onClick={openCreateProduct}><FaPlus /> Nouveau produit</Button>
                </div>
              </div>
              <Table responsive hover className="admin-table">
                <thead><tr><th>ID</th><th>Produit</th><th>Domaine</th><th>Prix</th><th>Stock</th><th>Variantes</th><th>Actions</th></tr></thead>
                <tbody>
                  {paginatedProducts.map((product) => {
                    const variantes = typeof product.variantes === 'string' ? JSON.parse(product.variantes || '{}') : product.variantes || {};
                    return (
                      <tr key={product.id_produit}>
                        <td>{product.id_produit}</td>
                        <td><strong>{product.titre}</strong><br /><small>{product.description}</small></td>
                        <td><Badge bg="info">{product.categorie}</Badge></td>
                        <td>{formatPrice(product.prix_xaf)} FCFA</td>
                        <td><Badge bg={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}>{product.stock}</Badge></td>
                        <td><small>Tailles: {(variantes.tailles || []).join(', ') || '-'}<br />Couleurs: {(variantes.couleurs || []).join(', ') || '-'}</small></td>
                        <td className="admin-actions">
                          <Button size="sm" variant="outline-primary" onClick={() => openEditProduct(product)}><FaEdit /></Button>
                          <Button size="sm" variant="outline-info" onClick={() => handleGenerateBarcode(product)} title="Générer code-barres">📊</Button>
                          <Button size="sm" variant="outline-secondary" onClick={() => handleGenerateQRCode(product)} title="Générer QR code">📱</Button>
                          <Button size="sm" variant="outline-danger" onClick={() => deleteProduct(product.id_produit)}><FaTrash /></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {productTotalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.First onClick={() => setProductPage(1)} disabled={productPage === 1} />
                  <Pagination.Prev onClick={() => setProductPage(p => Math.max(1, p - 1))} disabled={productPage === 1} />
                  {[...Array(productTotalPages)].map((_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === productPage} onClick={() => setProductPage(i + 1)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setProductPage(p => Math.min(productTotalPages, p + 1))} disabled={productPage === productTotalPages} />
                  <Pagination.Last onClick={() => setProductPage(productTotalPages)} disabled={productPage === productTotalPages} />
                </Pagination>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="stock" title={`Stock (${stockAlerts.length} alertes)`}>
          <Row className="g-3 mb-4">
            <Col lg={6}>
              <Card className="admin-panel h-100">
                <Card.Body>
                  <h4>Prévision de rupture de stock</h4>
                  <p className="text-muted mb-3">Produits qui risquent de rupture dans les 7 jours</p>
                  {stockForecast.length === 0 ? (
                    <p className="text-muted">Aucun produit en risque de rupture</p>
                  ) : (
                    <Table responsive size="sm" className="admin-table">
                      <thead><tr><th>Produit</th><th>Stock actuel</th><th>Vente/jour</th><th>Jours restants</th></tr></thead>
                      <tbody>
                        {stockForecast.map((forecast) => (
                          <tr key={forecast.id_produit}>
                            <td><strong>{forecast.titre}</strong><br /><small>{forecast.categorie}</small></td>
                            <td><Badge bg={forecast.stock_actuel < 5 ? 'danger' : 'warning'}>{forecast.stock_actuel}</Badge></td>
                            <td>{forecast.vente_moyenne_journaliere}</td>
                            <td><Badge bg="danger">{forecast.jours_restants} jours</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="admin-panel h-100">
                <Card.Body>
                  <h4>Historique des mouvements de stock</h4>
                  <p className="text-muted mb-3">Derniers mouvements enregistrés</p>
                  {stockMouvements.length === 0 ? (
                    <p className="text-muted">Aucun mouvement enregistré</p>
                  ) : (
                    <Table responsive size="sm" className="admin-table">
                      <thead><tr><th>Date</th><th>Produit</th><th>Type</th><th>Quantité</th><th>Stock avant/après</th><th>Utilisateur</th></tr></thead>
                      <tbody>
                        {stockMouvements.slice(0, 10).map((mouvement) => (
                          <tr key={mouvement.id_mouvement}>
                            <td>{new Date(mouvement.createdAt).toLocaleDateString('fr-FR')}</td>
                            <td>{mouvement.produit?.titre || '-'}</td>
                            <td><Badge bg={mouvement.type_mouvement === 'entree' ? 'success' : mouvement.type_mouvement === 'sortie' ? 'danger' : 'warning'}>{mouvement.type_mouvement}</Badge></td>
                            <td>{mouvement.quantite}</td>
                            <td>{mouvement.stock_avant} → {mouvement.stock_apres}</td>
                            <td>{mouvement.utilisateur?.nom || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="livraison" title={`Livraison (${affectations.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Gestion des livraisons</h4>
                <div className="d-flex gap-2 align-items-center">
                  <Button variant="primary" size="sm" onClick={() => setShowLivreurModal(true)}><FaPlus /> Ajouter un livreur</Button>
                </div>
              </div>
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <Card className="bg-light">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-3">
                        <div className="feature-icon bg-primary text-white"><FaTruck /></div>
                        <div>
                          <h6 className="mb-0">Livreurs disponibles</h6>
                          <h4 className="mb-0">{livreurs.filter(l => l.statut === 'disponible').length} / {livreurs.length}</h4>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="bg-light">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-3">
                        <div className="feature-icon bg-info text-white"><FaMapMarkerAlt /></div>
                        <div>
                          <h6 className="mb-0">Livraisons en cours</h6>
                          <h4 className="mb-0">{affectations.filter(a => a.statut === 'en_cours').length}</h4>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <h5 className="mb-3">Liste des livreurs</h5>
              {livreurs.length > 0 ? (
                <Table responsive hover className="admin-table mb-4">
                  <thead>
                    <tr>
                      <th>#</th><th>Nom</th><th>Prénom</th><th>Téléphone</th><th>Email</th><th>Véhicule</th><th>Plaque</th><th>Statut</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {livreurs.map((livreur) => (
                      <tr key={livreur.id_livreur}>
                        <td>{livreur.id_livreur}</td>
                        <td>{livreur.nom}</td>
                        <td>{livreur.prenom}</td>
                        <td>{livreur.telephone}</td>
                        <td>{livreur.email || '-'}</td>
                        <td>{livreur.vehicule}</td>
                        <td>{livreur.plaque_immatriculation}</td>
                        <td><Badge bg={livreur.statut === 'disponible' ? 'success' : 'warning'}>{livreur.statut}</Badge></td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEditLivreur(livreur)}><FaEdit /> Modifier</Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLivreur(livreur.id_livreur)}><FaTrash /> Supprimer</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mb-4">Aucun livreur disponible</p>
              )}
              <h5 className="mb-3">Affectations de livraison</h5>
              {affectations.length > 0 ? (
                <Table responsive hover className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Commande</th><th>Livreur</th><th>Date affectation</th><th>Statut</th><th>Météo</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affectations.map((affectation) => (
                      <tr key={affectation.id_affectation}>
                        <td>{affectation.id_affectation}</td>
                        <td>#{affectation.commande?.id_commande}</td>
                        <td>{affectation.livreur?.nom} {affectation.livreur?.prenom}</td>
                        <td>{new Date(affectation.date_affectation).toLocaleDateString('fr-FR')}</td>
                        <td><Badge bg={affectation.statut === 'livrée' ? 'success' : affectation.statut === 'en_cours' ? 'info' : 'warning'}>{affectation.statut}</Badge></td>
                        <td>{affectation.conditions_meteo || '-'}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleViewGPS(affectation)}><FaMapMarkerAlt /> GPS</Button>
                          <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleViewWeather(affectation)}><FaCloudSun /> Météo</Button>
                          {affectation.statut !== 'livrée' && (
                            <Button variant="outline-warning" size="sm" onClick={() => handleChangeLivreur(affectation)}><FaEdit /> Changer livreur</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">Aucune affectation de livraison</p>
              )}
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="remboursements" title={`Remboursements (${demandesRemboursement.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Demandes de remboursement / échange</h4>
              </div>
              {demandesRemboursement.length > 0 ? (
                <Table responsive hover className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Commande</th><th>Client</th><th>Type</th><th>Raison</th><th>Date demande</th><th>Statut</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandesRemboursement.map((demande) => (
                      <tr key={demande.id_demande}>
                        <td>{demande.id_demande}</td>
                        <td>#{demande.commande?.id_commande}</td>
                        <td>{demande.utilisateur?.nom || '-'}</td>
                        <td><Badge bg={demande.type_demande === 'remboursement' ? 'warning' : 'info'}>{demande.type_demande}</Badge></td>
                        <td>{demande.raison}</td>
                        <td>{new Date(demande.date_demande).toLocaleDateString('fr-FR')}</td>
                        <td><Badge bg={demande.statut === 'approuve' ? 'success' : demande.statut === 'refuse' ? 'danger' : demande.statut === 'traite' ? 'primary' : 'warning'}>{demande.statut}</Badge></td>
                        <td>
                          {demande.statut === 'en_attente' && (
                            <>
                              <Button variant="outline-success" size="sm" className="me-1" onClick={() => handleApproveRefund(demande.id_demande)}><FaUndo /> Approuver</Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleRejectRefund(demande.id_demande)}>Refuser</Button>
                            </>
                          )}
                          {demande.statut === 'approuve' && (
                            <Button variant="outline-primary" size="sm" onClick={() => handleMarkAsTraitee(demande.id_demande)}>Marquer traité</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">Aucune demande de remboursement</p>
              )}
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="codesbarres" title={`Codes-barres (${codesBarres.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Gestion des codes-barres</h4>
              </div>
              <Table responsive hover className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Code-barres</th><th>Type</th><th>Produit</th><th>Statut</th><th>Scans</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codesBarres.map((code) => (
                    <tr key={code.id_code}>
                      <td>{code.id_code}</td>
                      <td>{code.code_barre}</td>
                      <td><Badge bg={code.type_code === 'QR' ? 'info' : 'primary'}>{code.type_code}</Badge></td>
                      <td>{code.produit?.titre || 'N/A'}</td>
                      <td><Badge bg={code.actif ? 'success' : 'danger'}>{code.actif ? 'Actif' : 'Inactif'}</Badge></td>
                      <td>{code.nombre_scans}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleToggleBarcode(code.id_code)}>
                          {code.actif ? 'Désactiver' : 'Activer'}
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteBarcode(code.id_code)}>Supprimer</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="fournisseurs" title={`Fournisseurs (${fournisseurs.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Gestion des fournisseurs</h4>
                <Button variant="primary" onClick={openCreateSupplier}><FaPlus /> Nouveau fournisseur</Button>
              </div>
              <Table responsive hover className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Nom</th><th>Contact</th><th>Email</th><th>Téléphone</th><th>Ville</th><th>Actif</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fournisseurs.map((fournisseur) => (
                    <tr key={fournisseur.id_fournisseur}>
                      <td>{fournisseur.id_fournisseur}</td>
                      <td><strong>{fournisseur.nom}</strong></td>
                      <td>{fournisseur.contact || 'N/A'}</td>
                      <td>{fournisseur.email || 'N/A'}</td>
                      <td>{fournisseur.telephone || 'N/A'}</td>
                      <td>{fournisseur.ville || 'N/A'}</td>
                      <td><Badge bg={fournisseur.actif ? 'success' : 'danger'}>{fournisseur.actif ? 'Actif' : 'Inactif'}</Badge></td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEditSupplier(fournisseur)}><FaEdit /></Button>
                        <Button variant="outline-warning" size="sm" className="me-1" onClick={() => toggleSupplier(fournisseur.id_fournisseur)}>
                          {fournisseur.actif ? 'Désactiver' : 'Activer'}
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => deleteSupplier(fournisseur.id_fournisseur)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="inventaires" title={`Inventaires (${inventaires.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Gestion des inventaires</h4>
                <Button variant="primary" onClick={openCreateInventory}><FaPlus /> Nouvel inventaire</Button>
              </div>
              <Table responsive hover className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Type</th><th>Zone</th><th>Date début</th><th>Statut</th><th>Total théorique</th><th>Total physique</th><th>Écart</th><th>Taux</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventaires.map((inventaire) => (
                    <tr key={inventaire.id_inventaire}>
                      <td>{inventaire.id_inventaire}</td>
                      <td><Badge bg="info">{inventaire.type_inventaire}</Badge></td>
                      <td>{inventaire.zone || 'N/A'}</td>
                      <td>{new Date(inventaire.date_debut).toLocaleDateString()}</td>
                      <td><Badge bg={inventaire.statut === 'terminé' ? 'success' : inventaire.statut === 'en cours' ? 'warning' : 'secondary'}>{inventaire.statut}</Badge></td>
                      <td>{inventaire.total_theorique}</td>
                      <td>{inventaire.total_physique}</td>
                      <td>{inventaire.ecart}</td>
                      <td>{inventaire.taux_correspondance?.toFixed(2)}%</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEditInventory(inventaire)}><FaEdit /></Button>
                        <Button variant="outline-danger" size="sm" onClick={() => deleteInventory(inventaire.id_inventaire)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="zones" title={`Zones (${zones.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Gestion des zones de stockage</h4>
                <Button variant="primary" onClick={openCreateZone}><FaPlus /> Nouvelle zone</Button>
              </div>
              <Table responsive hover className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Nom</th><th>Type</th><th>Description</th><th>Capacité</th><th>Actif</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone) => (
                    <tr key={zone.id_zone}>
                      <td>{zone.id_zone}</td>
                      <td><strong>{zone.nom}</strong></td>
                      <td><Badge bg="info">{zone.type_zone}</Badge></td>
                      <td>{zone.description || 'N/A'}</td>
                      <td>{zone.capacite}</td>
                      <td><Badge bg={zone.actif ? 'success' : 'danger'}>{zone.actif ? 'Actif' : 'Inactif'}</Badge></td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEditZone(zone)}><FaEdit /></Button>
                        <Button variant="outline-warning" size="sm" className="me-1" onClick={() => toggleZone(zone.id_zone)}>
                          {zone.actif ? 'Désactiver' : 'Activer'}
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => deleteZone(zone.id_zone)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="caisses" title={`Caisses (${caisses.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Gestion des caisses</h4>
                <Button variant="primary" onClick={openCreateCash}><FaPlus /> Nouvelle caisse</Button>
              </div>
              <Table responsive hover className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Nom</th><th>Solde initial</th><th>Solde actuel</th><th>Date ouverture</th><th>Statut</th><th>Responsable</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {caisses.map((caisse) => (
                    <tr key={caisse.id_caisse}>
                      <td>{caisse.id_caisse}</td>
                      <td><strong>{caisse.nom}</strong></td>
                      <td>{formatPrice(caisse.solde_initial)} FCFA</td>
                      <td>{formatPrice(caisse.solde_actuel)} FCFA</td>
                      <td>{new Date(caisse.date_ouverture).toLocaleDateString()}</td>
                      <td><Badge bg={caisse.statut === 'ouverte' ? 'success' : 'danger'}>{caisse.statut}</Badge></td>
                      <td>{caisse.responsable_actuel || 'N/A'}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEditCash(caisse)}><FaEdit /></Button>
                        <Button variant="outline-warning" size="sm" className="me-1" onClick={() => caisse.statut === 'ouverte' ? closeCash(caisse.id_caisse) : openCash(caisse.id_caisse)}>
                          {caisse.statut === 'ouverte' ? 'Fermer' : 'Ouvrir'}
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => deleteCash(caisse.id_caisse)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="avoirs" title={`Avoirs (${avoirs.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Gestion des avoirs</h4>
                <Button variant="primary" onClick={openCreateCredit}><FaPlus /> Nouvel avoir</Button>
              </div>
              <Table responsive hover className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Numéro</th><th>Montant</th><th>Commande</th><th>Date émission</th><th>Statut</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {avoirs.map((avoir) => (
                    <tr key={avoir.id_avoir}>
                      <td>{avoir.id_avoir}</td>
                      <td><strong>{avoir.numero_avoir}</strong></td>
                      <td>{formatPrice(avoir.montant)} FCFA</td>
                      <td>{avoir.commande?.id_commande || 'N/A'}</td>
                      <td>{new Date(avoir.date_emission).toLocaleDateString()}</td>
                      <td><Badge bg={avoir.statut === 'en attente' ? 'warning' : avoir.statut === 'utilisé' ? 'success' : 'danger'}>{avoir.statut}</Badge></td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEditCredit(avoir)}><FaEdit /></Button>
                        {avoir.statut === 'en attente' && (
                          <Button variant="outline-success" size="sm" className="me-1" onClick={() => applyCredit(avoir.id_avoir)}>Utiliser</Button>
                        )}
                        <Button variant="outline-danger" size="sm" onClick={() => deleteCredit(avoir.id_avoir)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="avis-livraison" title={`Avis livraison (${deliveryReviews.length})`}>
          <Card className="admin-panel">
            <Card.Body>
              <div className="admin-section-heading">
                <h4>Avis sur les livraisons</h4>
              </div>
              {deliveryReviews.length > 0 ? (
                <Table responsive hover className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Client</th><th>Email</th><th>Commande</th><th>Montant</th><th>Note</th><th>Commentaire</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryReviews.map((review) => (
                      <tr key={review.id_avis}>
                        <td>{review.id_avis}</td>
                        <td>{review.Utilisateur?.nom || '-'}</td>
                        <td>{review.Utilisateur?.email || '-'}</td>
                        <td>#{review.Commande?.id_commande}</td>
                        <td>{formatPrice(review.Commande?.total_xaf)} FCFA</td>
                        <td>
                          <Badge bg={review.note >= 4 ? 'success' : review.note >= 3 ? 'warning' : 'danger'}>
                            {'⭐'.repeat(review.note)}
                          </Badge>
                        </td>
                        <td>{review.commentaire || '-'}</td>
                        <td>{new Date(review.createdAt).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">Aucun avis sur la livraison</p>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <Modal show={showPromoModal} onHide={() => setShowPromoModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitPromo}>
            <Form.Group className="mb-3"><Form.Label>Code</Form.Label><Form.Control value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Remise (%)</Form.Label><Form.Control type="number" min="1" max="100" value={promoForm.pourcentage_remise} onChange={(e) => setPromoForm({ ...promoForm, pourcentage_remise: Number(e.target.value) })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Date d'expiration</Form.Label><Form.Control type="date" value={promoForm.date_expiration} onChange={(e) => setPromoForm({ ...promoForm, date_expiration: e.target.value })} required /></Form.Group>
            <Form.Check className="mb-3" label="Promotion active" checked={promoForm.est_active} onChange={(e) => setPromoForm({ ...promoForm, est_active: e.target.checked })} />
            <Button type="submit">Enregistrer</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitProduct}>
            <Form.Group className="mb-3"><Form.Label>Titre</Form.Label><Form.Control value={productForm.titre} onChange={(e) => setProductForm({ ...productForm, titre: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} /></Form.Group>
            <Row>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Domaine</Form.Label><Form.Select value={productForm.categorie} onChange={(e) => setProductForm({ ...productForm, categorie: e.target.value })}><option>Football</option><option>Running</option><option>Fitness</option><option>Tennis</option><option>Basketball</option><option>Natation</option><option>Cyclisme</option><option>Boxe</option></Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Prix FCFA</Form.Label><Form.Control type="number" value={productForm.prix_xaf} onChange={(e) => setProductForm({ ...productForm, prix_xaf: e.target.value })} required /></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Stock</Form.Label><Form.Control type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required /></Form.Group></Col>
            </Row>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Tailles séparées par virgule</Form.Label><Form.Control value={variantSizes} onChange={(e) => setVariantSizes(e.target.value)} placeholder="S, M, L, XL" /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Couleurs séparées par virgule</Form.Label><Form.Control value={variantColors} onChange={(e) => setVariantColors(e.target.value)} placeholder="Rouge, Bleu, Noir" /></Form.Group></Col>
            </Row>
            <Button type="submit">Enregistrer</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showLivreurModal} onHide={() => setShowLivreurModal(false)}>
        <Modal.Header closeButton><Modal.Title>Ajouter un livreur</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Nom</Form.Label><Form.Control value={livreurForm.nom} onChange={(e) => setLivreurForm({ ...livreurForm, nom: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Prénom</Form.Label><Form.Control value={livreurForm.prenom} onChange={(e) => setLivreurForm({ ...livreurForm, prenom: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Téléphone</Form.Label><Form.Control value={livreurForm.telephone} onChange={(e) => setLivreurForm({ ...livreurForm, telephone: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={livreurForm.email} onChange={(e) => setLivreurForm({ ...livreurForm, email: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Véhicule</Form.Label><Form.Select value={livreurForm.vehicule} onChange={(e) => setLivreurForm({ ...livreurForm, vehicule: e.target.value })} required><option>Moto</option><option>Scooter</option><option>Vélo</option><option>Voiture</option></Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Plaque d'immatriculation</Form.Label><Form.Control value={livreurForm.plaque_immatriculation} onChange={(e) => setLivreurForm({ ...livreurForm, plaque_immatriculation: e.target.value })} required /></Form.Group>
            <Button variant="primary" onClick={handleCreateLivreur}>Enregistrer</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditLivreurModal} onHide={() => setShowEditLivreurModal(false)}>
        <Modal.Header closeButton><Modal.Title>Modifier le livreur</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Nom</Form.Label><Form.Control value={livreurForm.nom} onChange={(e) => setLivreurForm({ ...livreurForm, nom: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Prénom</Form.Label><Form.Control value={livreurForm.prenom} onChange={(e) => setLivreurForm({ ...livreurForm, prenom: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Téléphone</Form.Label><Form.Control value={livreurForm.telephone} onChange={(e) => setLivreurForm({ ...livreurForm, telephone: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={livreurForm.email} onChange={(e) => setLivreurForm({ ...livreurForm, email: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Véhicule</Form.Label><Form.Select value={livreurForm.vehicule} onChange={(e) => setLivreurForm({ ...livreurForm, vehicule: e.target.value })} required><option>Moto</option><option>Scooter</option><option>Vélo</option><option>Voiture</option></Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Plaque d'immatriculation</Form.Label><Form.Control value={livreurForm.plaque_immatriculation} onChange={(e) => setLivreurForm({ ...livreurForm, plaque_immatriculation: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Statut</Form.Label><Form.Select value={livreurForm.statut || 'disponible'} onChange={(e) => setLivreurForm({ ...livreurForm, statut: e.target.value })} required><option value="disponible">Disponible</option><option value="en livraison">En livraison</option><option value="indisponible">Indisponible</option></Form.Select></Form.Group>
            <Button variant="primary" onClick={handleUpdateLivreur}>Enregistrer</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showChangeLivreurModal} onHide={() => setShowChangeLivreurModal(false)}>
        <Modal.Header closeButton><Modal.Title>Changer de livreur</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedAffectationForChange && (
            <div>
              <p><strong>Commande:</strong> #{selectedAffectationForChange.commande?.id_commande}</p>
              <p><strong>Livreur actuel:</strong> {selectedAffectationForChange.livreur?.nom} {selectedAffectationForChange.livreur?.prenom}</p>
              <Form.Group className="mb-3">
                <Form.Label>Nouveau livreur</Form.Label>
                <Form.Select value={newLivreurId} onChange={(e) => setNewLivreurId(e.target.value)} required>
                  <option value="">Sélectionner un livreur disponible</option>
                  {livreurs.filter(l => l.statut === 'disponible' && l.id_livreur !== selectedAffectationForChange.id_livreur).map(livreur => (
                    <option key={livreur.id_livreur} value={livreur.id_livreur}>
                      {livreur.nom} {livreur.prenom} - {livreur.vehicule} ({livreur.plaque_immatriculation})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button variant="primary" onClick={handleConfirmChangeLivreur} disabled={!newLivreurId}>Confirmer le changement</Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showBarcodeModal} onHide={() => setShowBarcodeModal(false)}>
        <Modal.Header closeButton><Modal.Title>Générer code-barres / QR Code</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedProductForBarcode && (
            <div>
              <p><strong>Produit:</strong> {selectedProductForBarcode.titre}</p>
              {generatedBarcode && (
                <div className="text-center mt-3">
                  <h6>Code-barres EAN13 généré</h6>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '4px', padding: '20px', border: '2px solid #ddd', display: 'inline-block' }}>
                    {generatedBarcode}
                  </div>
                </div>
              )}
              {generatedQRCode && (
                <div className="text-center mt-3">
                  <h6>QR Code généré</h6>
                  <img src={generatedQRCode} alt="QR Code" style={{ maxWidth: '200px' }} />
                </div>
              )}
              <div className="mt-3 d-flex gap-2">
                <Button variant="primary" onClick={handleSaveBarcode}>Enregistrer</Button>
                <Button variant="secondary" onClick={() => setShowBarcodeModal(false)}>Annuler</Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showWeatherModal} onHide={() => setShowWeatherModal(false)}>
        <Modal.Header closeButton><Modal.Title>Informations de livraison</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedAffectation && (
            <div>
              <h5>Commande #{selectedAffectation.commande?.id_commande}</h5>
              <p>Livreur: {selectedAffectation.livreur?.nom} {selectedAffectation.livreur?.prenom}</p>
              {gpsData && (
                <div className="mt-3">
                  <h6><FaMapMarkerAlt /> Position GPS</h6>
                  <p>Latitude: {gpsData.latitude}</p>
                  <p>Longitude: {gpsData.longitude}</p>
                  <p>Dernière mise à jour: {gpsData.derniere_mise_a_jour ? new Date(gpsData.derniere_mise_a_jour).toLocaleString('fr-FR') : 'N/A'}</p>
                </div>
              )}
              {weatherData && (
                <div className="mt-3">
                  <h6><FaCloudSun /> Météo</h6>
                  <p>Condition: {weatherData.condition || 'Ensoleillé'}</p>
                  <p>Température: {weatherData.temperature || '28'}°C</p>
                  <p>Humidité: {weatherData.humidity || '65'}%</p>
                  <p>Vent: {weatherData.wind || '12'} km/h</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={showSupplierModal} onHide={() => setShowSupplierModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitSupplier}>
            <Form.Group className="mb-3"><Form.Label>Nom</Form.Label><Form.Control value={supplierForm.nom} onChange={(e) => setSupplierForm({ ...supplierForm, nom: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Contact</Form.Label><Form.Control value={supplierForm.contact} onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Téléphone</Form.Label><Form.Control value={supplierForm.telephone} onChange={(e) => setSupplierForm({ ...supplierForm, telephone: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Ville</Form.Label><Form.Control value={supplierForm.ville} onChange={(e) => setSupplierForm({ ...supplierForm, ville: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Adresse</Form.Label><Form.Control as="textarea" rows={2} value={supplierForm.adresse} onChange={(e) => setSupplierForm({ ...supplierForm, adresse: e.target.value })} /></Form.Group>
            <Button variant="primary" type="submit">{editingSupplier ? 'Modifier' : 'Créer'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showInventoryModal} onHide={() => setShowInventoryModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingInventory ? 'Modifier l\'inventaire' : 'Nouvel inventaire'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitInventory}>
            <Form.Group className="mb-3"><Form.Label>Type d'inventaire</Form.Label><Form.Select value={inventoryForm.type_inventaire} onChange={(e) => setInventoryForm({ ...inventoryForm, type_inventaire: e.target.value })} required><option value="général">Général</option><option value="partiel">Partiel</option></Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Zone</Form.Label><Form.Select value={inventoryForm.zone} onChange={(e) => setInventoryForm({ ...inventoryForm, zone: e.target.value })}><option value="">Toutes les zones</option><option value="surface de vente">Surface de vente</option><option value="mezzanine">Mezzanine</option><option value="entrepôt">Entrepôt</option></Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Date de début</Form.Label><Form.Control type="date" value={inventoryForm.date_debut} onChange={(e) => setInventoryForm({ ...inventoryForm, date_debut: e.target.value })} required /></Form.Group>
            <Button variant="primary" type="submit">{editingInventory ? 'Modifier' : 'Créer'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showZoneModal} onHide={() => setShowZoneModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingZone ? 'Modifier la zone' : 'Nouvelle zone'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitZone}>
            <Form.Group className="mb-3"><Form.Label>Nom</Form.Label><Form.Control value={zoneForm.nom} onChange={(e) => setZoneForm({ ...zoneForm, nom: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Type de zone</Form.Label><Form.Select value={zoneForm.type_zone} onChange={(e) => setZoneForm({ ...zoneForm, type_zone: e.target.value })} required><option value="surface de vente">Surface de vente</option><option value="mezzanine">Mezzanine</option><option value="entrepôt">Entrepôt</option></Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} value={zoneForm.description} onChange={(e) => setZoneForm({ ...zoneForm, description: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Capacité</Form.Label><Form.Control type="number" value={zoneForm.capacite} onChange={(e) => setZoneForm({ ...zoneForm, capacite: Number(e.target.value) })} /></Form.Group>
            <Button variant="primary" type="submit">{editingZone ? 'Modifier' : 'Créer'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showCashModal} onHide={() => setShowCashModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingCash ? 'Modifier la caisse' : 'Nouvelle caisse'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitCash}>
            <Form.Group className="mb-3"><Form.Label>Nom</Form.Label><Form.Control value={cashForm.nom} onChange={(e) => setCashForm({ ...cashForm, nom: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Solde initial (FCFA)</Form.Label><Form.Control type="number" value={cashForm.solde_initial} onChange={(e) => setCashForm({ ...cashForm, solde_initial: Number(e.target.value) })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Responsable actuel</Form.Label><Form.Control value={cashForm.responsable_actuel} onChange={(e) => setCashForm({ ...cashForm, responsable_actuel: e.target.value })} /></Form.Group>
            <Button variant="primary" type="submit">{editingCash ? 'Modifier' : 'Créer'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showCreditModal} onHide={() => setShowCreditModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingCredit ? 'Modifier l\'avoir' : 'Nouvel avoir'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitCredit}>
            <Form.Group className="mb-3"><Form.Label>Numéro d'avoir</Form.Label><Form.Control value={creditForm.numero_avoir} onChange={(e) => setCreditForm({ ...creditForm, numero_avoir: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Montant (FCFA)</Form.Label><Form.Control type="number" value={creditForm.montant} onChange={(e) => setCreditForm({ ...creditForm, montant: Number(e.target.value) })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Commande associée</Form.Label><Form.Select value={creditForm.id_commande} onChange={(e) => setCreditForm({ ...creditForm, id_commande: e.target.value })}><option value="">Aucune commande</option>{orders.map((order) => <option key={order.id_commande} value={order.id_commande}>Commande #{order.id_commande}</option>)}</Form.Select></Form.Group>
            <Button variant="primary" type="submit">{editingCredit ? 'Modifier' : 'Créer'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showClientHistoryModal} onHide={() => setShowClientHistoryModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Historique du client</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedClientHistory && (
            <>
              <h5>Informations personnelles</h5>
              <p><strong>Nom:</strong> {selectedClientHistory.client.nom}</p>
              <p><strong>Email:</strong> {selectedClientHistory.client.email}</p>
              <p><strong>Points de fidélité:</strong> {selectedClientHistory.client.points_fidelite}</p>
              <p><strong>Adresse:</strong> {selectedClientHistory.client.adresse_livraison || 'Non renseignée'}</p>
              <p><strong>Date d'inscription:</strong> {new Date(selectedClientHistory.client.createdAt).toLocaleDateString('fr-FR')}</p>
              
              <hr />
              
              <h5>Commandes ({selectedClientHistory.orders.length})</h5>
              {selectedClientHistory.orders.length === 0 ? (
                <p className="text-muted">Aucune commande</p>
              ) : (
                <Table responsive size="sm">
                  <thead>
                    <tr>
                      <th>Commande #</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClientHistory.orders.map((order) => (
                      <tr key={order.id_commande}>
                        <td>#{order.id_commande}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>{formatPrice(order.total_xaf)} FCFA</td>
                        <td><Badge bg={order.statut === 'Livrée' ? 'success' : order.statut === 'Payée' ? 'primary' : 'warning'}>{order.statut}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;



