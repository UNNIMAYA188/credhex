import React from 'react';
import { supabase } from '../../supabaseClient';


export default function CertificateUploader({ onUpload }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const { data: { user } } = await supabase.auth.getUser();
    const filePath = `${user.id}/${file.name}`;

    const { error } = await supabase.storage
      .from('certificates')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (!error) {
      alert('Uploaded!');
      onUpload();
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload Your Certificates Here!</h3>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
    </div>
  );
}
