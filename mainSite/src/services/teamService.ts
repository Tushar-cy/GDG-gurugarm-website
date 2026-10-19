import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/team`;

export interface TeamMember {
  id?: number;
  _id?: string;
  name: string;
  role: string;
  category?: string;
  description: string;
  avatar: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  tags?: string;
  isLeader?: boolean;
  displayOrder?: number;
}

export const teamService = {
  async getAllTeamMembers(): Promise<TeamMember[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched team members:', data);
      
      return data.map((member: any) => ({
        ...member,
        id: member._id ? parseInt(member._id) : member.id
      }));
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  async createTeamMember(member: TeamMember): Promise<TeamMember> {
    try {
      console.log('Creating team member:', member);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create team member error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Created team member:', data);
      return {
        ...data,
        id: data._id ? parseInt(data._id) : data.id
      };
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  async updateTeamMember(id: number, member: TeamMember): Promise<TeamMember> {
    try {
      console.log('Updating team member:', id, member);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update team member error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Updated team member:', data);
      return {
        ...data,
        id: data._id ? parseInt(data._id) : data.id
      };
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  async deleteTeamMember(id: number): Promise<void> {
    try {
      console.log('Deleting team member:', id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete team member error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      console.log('Deleted team member successfully');
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },
};
