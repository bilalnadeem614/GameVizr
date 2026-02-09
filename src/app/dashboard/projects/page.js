'use client';

import { useState, useEffect } from 'react';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch projects from API
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Projects</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 shadow">
                        <h2 className="text-xl font-semibold">{project.name}</h2>
                        <p className="text-gray-600 mt-2">{project.description}</p>
                        <p className="text-sm text-gray-500 mt-4">Status: {project.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}