import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

export default function Dashboard() {
  const [certs, setCerts] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const navigate = useNavigate();

  const fetchCertificates = async () => {
    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error('User not found.');
      navigate('/login');
      return;
    }

    const uid = user.id;
    setUserId(uid);

    const { data, error } = await supabase.storage
      .from('certificates')
      .list(uid + '/', { limit: 100 });

    if (!error) setCerts(data);
    else toast.error('Error fetching files');

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleDelete = async (fileName) => {
    const confirmDelete = window.confirm(`Delete "${fileName}"?`);
    if (!confirmDelete) return;

    const { error } = await supabase.storage
      .from('certificates')
      .remove([`${userId}/${fileName}`]);

    if (error) toast.error('Delete failed');
    else {
      toast.success('Deleted successfully');
      fetchCertificates();
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (!files.length) return;

    const file = files[0];
    const { error } = await supabase.storage
      .from('certificates')
      .upload(`${userId}/${file.name}`, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      toast.error('Upload failed.');
    } else {
      toast.success('File uploaded!');
      fetchCertificates();
    }
  };

  const handlePreview = (url) => {
    setModalUrl(url);
    setModalOpen(true);
  };

  const filteredCerts = certs.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <div className="dashboard">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar */}
      <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 999 }}>
        <div className="nav-left">
          <img src="/logo.jpg" alt="Logo" className="logo" />
          <span className="brand">CredHex</span>
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#upload">Upload</a></li>
          <li><a href="#files">View Uploaded Files</a></li>
        </ul>
      </nav>

      {/* Home Section */}
      <section id="home" className="section" style={{ padding: '4rem 2rem' }}>
        <h1 style={{ fontFamily: "papyrus" }}>Welcome to CredHex</h1>
        <p style={{ fontFamily: "cursive", maxWidth: "700px" , paddingLeft:"100px"}}>
          Securely upload and manage your digital certificates. Access them anytime, anywhere.
        </p>
      </section>

      <hr className="section-divider" />

     {/* Upload Section with File Chooser + Drag-and-Drop */}
<section
  id="upload"
  className="section"
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDrop}
  style={{
    padding: '2rem',
    border: '2px dashed #007BFF',
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderRadius: '10px',
    marginBottom: '2rem',
  }}
>
  <h2 style={{ fontFamily: "papyrus", marginBottom: '1rem' }}>Upload Certificate</h2>

  <input
    type="file"
    accept="application/pdf"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const { error } = await supabase.storage
        .from('certificates')
        .upload(`${userId}/${file.name}`, file, {
          upsert: true,
          contentType: file.type,
        });

      if (error) {
        toast.error('Upload failed.');
      } else {
        toast.success('File uploaded!');
        fetchCertificates();
      }
    }}
    style={{
      padding: '8px',
      border: '1px solid #aaa',
      borderRadius: '6px',
      marginBottom: '1rem',
    }}
  />

  <p style={{ color: '#666' }}>Or drag and drop your PDF file below ⬇</p>
</section>

      <hr className="section-divider" />

      {/* View Files Section with Search */}
      <section id="files" className="section" style={{ padding: '3rem 2rem' }}>
        <h2 style={{ fontFamily: "papyrus" }}>Your Uploaded Certificates</h2>

        <input
          type="text"
          placeholder="Search certificates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px',
            margin: '1rem 0',
            border: '1px solid #aaa',
            borderRadius: '6px',
            width: '100%',
            maxWidth: '400px',
            paddingRight:'530px'
          }}
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredCerts.length === 0 ? (
          <p>No matching certificates found.</p>
        ) : (
          <div className="grid-container">
            {filteredCerts.map(cert => {
              const url = `https://vckgeyxonrgydsfbrabj.supabase.co/storage/v1/object/public/certificates/${userId}/${cert.name}`;
              return (
                <div className="cert-card" key={cert.name} style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "1rem", borderRadius: "10px" }}>
                  <div
                    className="thumbnail-link"
                    onClick={() => handlePreview(url)}
                    style={{ cursor: 'pointer', height: '200px', overflow: 'hidden', border: '1px solid #ccc', borderRadius: '6px' }}
                  >
                   <iframe
  src={`${url}#toolbar=0`}
  title={cert.name}
  className="thumbnail-preview"
  style={{
    width: '100%',
    height: '100%',
    border: 'none',
    objectFit:'cover' // Ensure full-cover fit
  }}
></iframe>

                  </div>
                  <p className="cert-name" style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{cert.name}</p>
                  <div className="cert-actions" style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                    <a href={url} download className="btn action-btn">Download</a>
                    <button onClick={() => handleDelete(cert.name)} className="btn action-btn delete">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <br />
        <button className="logout-btn" onClick={handleLogout}>
          🔒 Logout
        </button>
      </section>

   <Modal
  isOpen={modalOpen}
  onRequestClose={() => {
    setModalOpen(false);
    document.getElementById('files')?.scrollIntoView({ behavior: 'smooth' });
  }}
  shouldCloseOnOverlayClick={true} // ✅ ensures clicking outside closes
  style={{
    content: {
      top: '50%', left: '50%', right: 'auto', bottom: 'auto',
      marginRight: '-50%', transform: 'translate(-50%, -50%)',
      width: '90%', height: '90%', padding: '0',
      borderRadius: '10px', overflow: 'hidden'
    },
    overlay: {
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.8)',
      cursor: 'pointer' // optional: shows it's clickable
    }
  }}
>
  {/* Exit Button */}
  <div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0.5rem 1rem',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc'
  }}>
</div>
  {/* PDF Preview */}
  <iframe
    src={modalUrl}
    title="Preview"
    style={{ width: '100%', height: 'calc(1000% - 20px)', border:'blue' }}
  />
</Modal>

      {/* Footer */}
      <footer className="footer" style={{ marginTop: '4rem' }}>
        <div className="footer-content">
          <div className="footer-brand">
            <h2>CredHex</h2>
            <p>Your secure digital certificate vault.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#upload">Upload</a></li>
              <li><a href="#files">My Certificates</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Email: support@credhex.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CredHex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
