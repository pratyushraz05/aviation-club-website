import React from 'react';
import { Link } from "react-router-dom";
import "./Projects.css";

export default function ProjectCard({ project, isHead, onEdit, onDelete }) {
  const projectId = project._id || project.projectId || project.id;
  const isOngoing = project.status === 'Ongoing';

  return (
    <div className="project-card">
      <div className="project-status">
        {isOngoing ? '🚁 ' : '✅ '} {project.status || (isOngoing ? 'Ongoing' : 'Completed')}
      </div>
      
      <h3 className="card-title">{project.title}</h3>
      <p className="card-desc">{project.description}</p>

      {/* Tags for technologies */}
      <div className="tech-tags">
        {project.technologies?.map((tech, index) => (
          <span key={index} className="tech-tag">
            {typeof tech === "object" ? tech.name : tech}
          </span>
        ))}
      </div>

      <div
        className="card-footer-link"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '16px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <Link to={`/projects/${projectId}`} className="link-btn">
          View Project →
        </Link>

        {isHead && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onEdit && onEdit(project)}
              style={{
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(project)}
              style={{
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
