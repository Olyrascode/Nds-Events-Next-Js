"use client";

import './_Contact.scss';
import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formulaire soumis !');
    console.log(formData);
  };

  return (
    <div>
      <div className='contactHeader'>
        <h1>Contact</h1>
      </div>
      <div className='contactInfo'>
        <p>
          <strong>Pour une commande, veuillez la faire en ligne directement.</strong> <br/>
          Pour tout renseignement, n&apos;hésitez pas à nous contacter!<br/>
          <strong>Nous ne pouvons pas faire de devis personnalisé pour des commandes inférieures à 200 € TTC. </strong><br/>
          <strong>Horaires d&apos;ouverture (Visites sur rendez-vous) : </strong> <br/>
          Du lundi au vendredi de 9h00 à 12h30 et de 14h00 à 17h30 et le samedi de 9h00 à 12h00
        </p>
      </div>
      <div style={{ backgroundColor: 'black', padding: '20px' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <label style={{ color: 'white' }}>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <label style={{ color: 'white' }}>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <label style={{ color: 'white' }}>E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <label style={{ color: 'white' }}>Numéro de Téléphone</label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <label style={{ color: 'white' }}>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
