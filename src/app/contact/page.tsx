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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
          <strong style={{color:'red', fontSize:'22px'}}>Pour une commande, veuillez la faire en ligne directement.</strong> <br/>
          Pour un devis personnalisé, n'hésitez pas à nous contacter ci-dessous.<br/>
          <strong>Nous ne pouvons pas faire de devis personnalisé pour des commandes inférieures à 200 € TTC.</strong><br/>
          <strong>- Le minimum de commande est de 49 € TTC (hors frais de livraison éventuels).</strong><br/>
          <strong>Horaires d&apos;ouverture (Visites sur rendez-vous) :</strong> <br/>
          Du lundi au vendredi de 9h00 à 12h30 et de 14h00 à 17h30 et le samedi de 9h00 à 12h00
        </p>
      </div>
      <div style={{ backgroundColor: 'black', padding: '20px' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', marginTop: '50px' }}>
          <label style={{ color: 'white' }}>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius:'8px' }}
          />

          <label style={{ color: 'white' }}>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius:'8px' }}
          />

          <label style={{ color: 'white' }}>E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius:'8px' }}
          />

          <label style={{ color: 'white' }}>Numéro de Téléphone</label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius:'8px' }}
          />

          <label style={{ color: 'white' }}>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', minHeight:'200px', borderRadius:'8px' }}
          />

          <button className='submit'  type="submit" style={{ padding: '10px 30px', cursor: 'pointer', marginBottom: '50px', backgroundColor:'#ff6b00', color:'white', fontSize:'18px', borderRadius:'7px', border:'none' }}>
            Envoyer
          </button>
        </form>
        <p style={{color:'white', textAlign:'center'}}>En nous contactant, j’accepte que mes données à caractère personnel fassent l'objet d'un traitement informatique pour traiter ma demande de contact, en assurer le suivi et me recontacter.</p>
      </div>
    </div>
  );
}

export default Contact;
