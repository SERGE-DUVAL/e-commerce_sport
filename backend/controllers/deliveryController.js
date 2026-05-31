const Database = require('better-sqlite3');
const path = require('path');
const PDFDocument = require('pdfkit');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

// Créer un livreur
exports.createLivreur = async (req, res) => {
  try {
    const result = db.prepare(`
      INSERT INTO livreurs (nom, prenom, telephone, vehicule, plaque_immatriculation, statut, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'disponible', datetime('now'), datetime('now'))
    `).run(req.body.nom, req.body.prenom, req.body.telephone, req.body.vehicule, req.body.plaque_immatriculation);
    
    const livreur = db.prepare('SELECT * FROM livreurs WHERE id_livreur = ?').get(result.lastInsertRowid);
    res.status(201).json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les livreurs
exports.getAllLivreurs = async (req, res) => {
  try {
    const livreurs = db.prepare('SELECT * FROM livreurs').all();
    console.log('Livreurs found:', livreurs.length);
    res.json(livreurs);
  } catch (error) {
    console.error('Erreur getAllLivreurs:', error);
    // Return empty array instead of error to prevent frontend issues
    res.json([]);
  }
};

// Récupérer un livreur par ID
exports.getLivreurById = async (req, res) => {
  try {
    const livreur = db.prepare('SELECT * FROM livreurs WHERE id_livreur = ?').get(req.params.id);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }
    res.json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier un livreur
exports.updateLivreur = async (req, res) => {
  try {
    const livreur = db.prepare('SELECT * FROM livreurs WHERE id_livreur = ?').get(req.params.id);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    const updates = [];
    const values = [];
    
    if (req.body.nom) { updates.push('nom = ?'); values.push(req.body.nom); }
    if (req.body.prenom) { updates.push('prenom = ?'); values.push(req.body.prenom); }
    if (req.body.telephone) { updates.push('telephone = ?'); values.push(req.body.telephone); }
    if (req.body.vehicule) { updates.push('vehicule = ?'); values.push(req.body.vehicule); }
    if (req.body.plaque_immatriculation) { updates.push('plaque_immatriculation = ?'); values.push(req.body.plaque_immatriculation); }
    if (req.body.statut) { updates.push('statut = ?'); values.push(req.body.statut); }
    if (req.body.latitude !== undefined) { updates.push('latitude = ?'); values.push(req.body.latitude); }
    if (req.body.longitude !== undefined) { updates.push('longitude = ?'); values.push(req.body.longitude); }
    
    updates.push('updated_at = datetime("now")');
    values.push(req.params.id);

    if (updates.length > 1) {
      db.prepare(`UPDATE livreurs SET ${updates.join(', ')} WHERE id_livreur = ?`).run(...values);
    }

    const updatedLivreur = db.prepare('SELECT * FROM livreurs WHERE id_livreur = ?').get(req.params.id);
    res.json(updatedLivreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un livreur
exports.deleteLivreur = async (req, res) => {
  try {
    const livreur = db.prepare('SELECT * FROM livreurs WHERE id_livreur = ?').get(req.params.id);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Vérifier si le livreur a des affectations en cours
    const affectationsEnCours = db.prepare(`
      SELECT * FROM affectations_livraison 
      WHERE id_livreur = ? AND statut = 'en livraison'
    `).all(req.params.id);

    if (affectationsEnCours.length > 0) {
      return res.status(400).json({ message: 'Impossible de supprimer un livreur avec des livraisons en cours' });
    }

    db.prepare('DELETE FROM livreurs WHERE id_livreur = ?').run(req.params.id);
    res.json({ message: 'Livreur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Affecter une commande à un livreur
exports.assignDelivery = async (req, res) => {
  try {
    const { id_commande, id_livreur, date_livraison_prevue } = req.body;

    // Vérifier que la commande existe
    const commande = db.prepare('SELECT * FROM commandes WHERE id_commande = ?').get(id_commande);
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que le livreur existe et est disponible
    const livreur = db.prepare('SELECT * FROM livreurs WHERE id_livreur = ?').get(id_livreur);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    if (livreur.statut !== 'disponible') {
      return res.status(400).json({ message: 'Le livreur n\'est pas disponible' });
    }

    // Créer l'affectation
    const result = db.prepare(`
      INSERT INTO affectations_livraison (id_commande, id_livreur, date_livraison_prevue, statut, created_at, updated_at)
      VALUES (?, ?, ?, 'en attente', datetime('now'), datetime('now'))
    `).run(id_commande, id_livreur, date_livraison_prevue);

    // Mettre à jour le statut de la commande
    db.prepare('UPDATE commandes SET statut = ?, updated_at = datetime("now") WHERE id_commande = ?')
      .run('En livraison', id_commande);

    // Mettre à jour le statut du livreur
    db.prepare('UPDATE livreurs SET statut = ?, updated_at = datetime("now") WHERE id_livreur = ?')
      .run('en livraison', id_livreur);

    const affectation = db.prepare('SELECT * FROM affectations_livraison WHERE id_affectation = ?').get(result.lastInsertRowid);
    res.status(201).json(affectation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour la position GPS d'un livreur
exports.updateLivreurLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const livreur = db.prepare('SELECT * FROM livreurs WHERE id_livreur = ?').get(req.params.id);

    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    db.prepare(`
      UPDATE livreurs 
      SET latitude = ?, longitude = ?, derniere_mise_a_jour_gps = datetime('now'), updated_at = datetime('now')
      WHERE id_livreur = ?
    `).run(latitude, longitude, req.params.id);

    const updatedLivreur = db.prepare('SELECT * FROM livreurs WHERE id_livreur = ?').get(req.params.id);
    res.json(updatedLivreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Calculer la météo pour une position GPS
exports.getWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude et longitude requises' });
    }

    // Simulation de météo basée sur la latitude
    const conditions = ['Ensoleillé', 'Nuageux', 'Pluvieux', 'Orageux', 'Brumeux'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Simulation de température basée sur la latitude
    const baseTemp = 25 - Math.abs(parseFloat(latitude));
    const temperature = (baseTemp + Math.random() * 10 - 5).toFixed(1);

    res.json({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      temperature: parseFloat(temperature),
      conditions: randomCondition,
      humidite: Math.floor(Math.random() * 40 + 40),
      vent: Math.floor(Math.random() * 30 + 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Calculer la distance entre deux points GPS
exports.calculateDistance = async (req, res) => {
  try {
    const { lat1, lon1, lat2, lon2 } = req.query;

    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return res.status(400).json({ message: 'Coordonnées requises' });
    }

    const R = 6371; // Rayon de la Terre en km
    const dLat = (parseFloat(lat2) - parseFloat(lat1)) * Math.PI / 180;
    const dLon = (parseFloat(lon2) - parseFloat(lon1)) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(parseFloat(lat1) * Math.PI / 180) * Math.cos(parseFloat(lat2) * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    res.json({
      distance: distance.toFixed(2),
      unit: 'km'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les affectations de livraison
exports.getAffectations = async (req, res) => {
  try {
    const affectations = db.prepare(`
      SELECT a.*, c.*, l.* 
      FROM affectations_livraison a
      LEFT JOIN commandes c ON a.id_commande = c.id_commande
      LEFT JOIN livreurs l ON a.id_livreur = l.id_livreur
      ORDER BY a.date_affectation DESC
    `).all();
    
    // Format the response to match the Sequelize structure
    const formatted = affectations.map(a => ({
      ...a,
      commande: {
        id_commande: a.id_commande,
        total_xaf: a.total_xaf,
        statut: a.statut,
        adresse_livraison: a.adresse_livraison
      },
      livreur: {
        id_livreur: a.id_livreur,
        nom: a.nom,
        prenom: a.prenom,
        telephone: a.telephone
      }
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le statut d'une affectation
exports.updateAffectationStatus = async (req, res) => {
  try {
    const { statut, notes } = req.body;
    const affectation = db.prepare('SELECT * FROM affectations_livraison WHERE id_affectation = ?').get(req.params.id);

    if (!affectation) {
      return res.status(404).json({ message: 'Affectation non trouvée' });
    }

    const updates = ['statut = ?', 'updated_at = datetime("now")'];
    const values = [statut];
    
    if (notes) {
      updates.push('notes = ?');
      values.push(notes);
    }

    if (statut === 'livrée') {
      updates.push('date_livraison_reelle = datetime("now")');
      // Mettre à jour le statut de la commande
      db.prepare('UPDATE commandes SET statut = ?, updated_at = datetime("now") WHERE id_commande = ?')
        .run('Livrée', affectation.id_commande);
      // Libérer le livreur
      db.prepare('UPDATE livreurs SET statut = ?, updated_at = datetime("now") WHERE id_livreur = ?')
        .run('disponible', affectation.id_livreur);
    }

    values.push(req.params.id);
    db.prepare(`UPDATE affectations_livraison SET ${updates.join(', ')} WHERE id_affectation = ?`).run(...values);

    const updatedAffectation = db.prepare('SELECT * FROM affectations_livraison WHERE id_affectation = ?').get(req.params.id);
    res.json(updatedAffectation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Générer un bordereau de livraison en PDF
exports.generateDeliveryNote = async (req, res) => {
  try {
    const affectation = db.prepare(`
      SELECT a.*, 
             c.*, u.nom as utilisateur_nom, u.email as utilisateur_email,
             l.nom as livreur_nom, l.prenom as livreur_prenom, l.telephone as livreur_telephone, 
             l.vehicule as livreur_vehicule, l.plaque_immatriculation as livreur_plaque
      FROM affectations_livraison a
      LEFT JOIN commandes c ON a.id_commande = c.id_commande
      LEFT JOIN utilisateurs u ON c.id_utilisateur = u.id_utilisateur
      LEFT JOIN livreurs l ON a.id_livreur = l.id_livreur
      WHERE a.id_affectation = ?
    `).get(req.params.id);

    if (!affectation) {
      return res.status(404).json({ message: 'Affectation non trouvée' });
    }

    // Récupérer les lignes de commande
    const lignes = db.prepare(`
      SELECT lc.*, p.titre, p.prix_xaf
      FROM ligne_commandes lc
      LEFT JOIN produits p ON lc.id_produit = p.id_produit
      WHERE lc.id_commande = ?
    `).all(affectation.id_commande);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `bordereau_livraison_${affectation.id_affectation}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    doc.pipe(res);

    // En-tête
    doc.rect(0, 0, doc.page.width, 100).fill('#1a237e');
    doc.fillColor('white').fontSize(28).text('Sport-Equip', 50, 35, { align: 'left' });
    doc.fontSize(14).text('Bordereau de Livraison', 50, 65, { align: 'left' });
    doc.fontSize(12).text(`N° ${affectation.id_affectation}`, 50, 85, { align: 'left' });

    // Informations client
    doc.fillColor('black');
    doc.moveDown(4);
    doc.fontSize(16).text('Informations Client', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Nom: ${affectation.utilisateur_nom || 'N/A'}`);
    doc.text(`Email: ${affectation.utilisateur_email || 'N/A'}`);
    doc.text(`Adresse: ${affectation.adresse_livraison || 'N/A'}`);

    // Informations commande
    doc.moveDown(2);
    doc.fontSize(16).text('Informations Commande', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Commande N°: ${affectation.id_commande}`);
    doc.text(`Date commande: ${new Date(affectation.created_at).toLocaleDateString('fr-FR')}`);
    doc.text(`Total: ${affectation.total_xaf.toLocaleString('fr-FR')} FCFA`);
    doc.text(`Moyen paiement: ${affectation.moyen_paiement}`);

    // Informations livreur
    doc.moveDown(2);
    doc.fontSize(16).text('Informations Livreur', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Nom: ${affectation.livreur_nom} ${affectation.livreur_prenom}`);
    doc.text(`Téléphone: ${affectation.livreur_telephone}`);
    doc.text(`Véhicule: ${affectation.livreur_vehicule}`);
    doc.text(`Plaque: ${affectation.livreur_plaque}`);

    // Détails articles
    doc.moveDown(2);
    doc.fontSize(16).text('Articles à livrer', { underline: true });
    doc.moveDown();

    const tableTop = doc.y;
    const tableHeaders = ['Article', 'Quantité', 'Prix unitaire', 'Total'];
    const columnWidths = [200, 80, 100, 100];
    const rowHeight = 30;
    const startX = 50;

    // En-tête tableau
    doc.fontSize(10).fillColor('#1a237e');
    tableHeaders.forEach((header, i) => {
      doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
        width: columnWidths[i],
        align: 'left'
      });
    });

    // Ligne de séparation
    doc.moveTo(startX, tableTop + 15)
       .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), tableTop + 15)
       .stroke();

    // Données articles
    doc.fillColor('black');
    lignes.forEach((ligne, index) => {
      const y = tableTop + 25 + (index * rowHeight);

      // Nouvelle page si nécessaire
      if (y > doc.page.height - 50) {
        doc.addPage();
        doc.fillColor('#1a237e');
        tableHeaders.forEach((header, i) => {
          doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), 50, {
            width: columnWidths[i],
            align: 'left'
          });
        });
        doc.moveTo(startX, 65)
           .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), 65)
           .stroke();
        doc.fillColor('black');
      }

      const rowData = [
        ligne.titre || 'Produit supprimé',
        ligne.quantite,
        `${ligne.prix_xaf} FCFA`,
        `${ligne.quantite * ligne.prix_xaf} FCFA`
      ];

      rowData.forEach((data, i) => {
        doc.text(data, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
          width: columnWidths[i],
          align: 'left'
        });
      });
    });

    // Signature
    doc.moveDown(3);
    doc.fontSize(12).text('Signature livreur:', 50, doc.y);
    doc.moveTo(50, doc.y + 30).lineTo(200, doc.y + 30).stroke();
    doc.fontSize(10).text('Date et heure:', 250, doc.y);
    doc.moveTo(250, doc.y + 30).lineTo(400, doc.y + 30).stroke();

    // Pied de page
    doc.fontSize(10).fillColor('gray');
    doc.text('Sport-Equip - Équipements Sportifs Professionnels', 50, doc.page.height - 30, {
      align: 'center'
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
