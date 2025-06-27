import React from 'react';
import { useStore } from '../store/useStore';

const AdminRules: React.FC = () => {
  const adminRules = useStore(state => state.adminRules);
  const updateAdminRules = useStore(state => state.updateAdminRules);

  const handleRuleToggle = (rule: keyof typeof adminRules) => {
    updateAdminRules({
      ...adminRules,
      [rule]: !adminRules[rule]
    });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#fff' }}>
        Admin Rules
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#ccc' }}>
          <input
            type="checkbox"
            checked={adminRules.allowReorder}
            onChange={() => handleRuleToggle('allowReorder')}
            style={{ marginRight: '0.5rem' }}
          />
          <span style={{ fontSize: '0.9rem' }}>Allow Reordering</span>
        </label>




      </div>
    </div>
  );
};

export default AdminRules; 