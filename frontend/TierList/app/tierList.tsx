import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

const tiers = [
  { id: 1, name: 'S' },
  { id: 2, name: 'A' },
  { id: 3, name: 'B' },
  { id: 4, name: 'C' },
  { id: 5, name: 'D' },
  { id: 6, name: 'F' },
];

const getTierColor = (tierName) => {
  switch (tierName) {
    case 'S': return '#00FF00';
    case 'A': return '#ADFF2F';
    case 'B': return '#FFFF00';
    case 'C': return '#FFA500';
    case 'D': return '#FF6347';
    case 'F': return '#FF0000';
    default: return '#FFFFFF';
  }
};

const TierList = () => {
  const { userID, subjectId } = useLocalSearchParams();
  const [tierAssignments, setTierAssignments] = useState({});
  const [tierItems, setTierItems] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [message, setMessage] = useState('');
  const [submissionString, setSubmissionString] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTierItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/tieritems/subject/${subjectId}`);
        setTierItems(response.data);
      } catch (error) {
        console.error('Error fetching tier items:', error);
        setMessage('Failed to load tier items');
      }
    };

    const fetchRanks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/itemranks');
        setRanks(response.data);
      } catch (error) {
        console.error('Error fetching ranks:', error);
        setMessage('Failed to load ranks');
      }
    };

    const loadData = async () => {
      await Promise.all([fetchTierItems(), fetchRanks()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const availableItems = tierItems.filter(
    (item) => !Object.values(tierAssignments).includes(item.name)
  );

  const handleDropToTier = (tierName, item) => {
    setTierAssignments((prev) => {
      const newAssignments = { ...prev };
      for (const tier in newAssignments) {
        if (newAssignments[tier] === item) {
          delete newAssignments[tier];
        }
      }
      newAssignments[tierName] = item;
      return newAssignments;
    });
  };

  const handleDropToBottom = (item) => {
    setTierAssignments((prev) => {
      const newAssignments = { ...prev };
      for (const tier in newAssignments) {
        if (newAssignments[tier] === item) {
          delete newAssignments[tier];
          break;
        }
      }
      return newAssignments;
    });
  };

  const handleSubmit = async () => {
    if (!userID) {
      setMessage('User ID is missing');
      return;
    }

    const userIdNum = parseInt(userID, 10);
    if (isNaN(userIdNum)) {
      setMessage('Invalid User ID');
      return;
    }

    const allTiersAssigned = tiers.every((tier) => tierAssignments[tier.name]);
    if (!allTiersAssigned) {
      setMessage('Please assign all tiers before submitting');
      return;
    }

    setIsSubmitting(true);
    setMessage('Submitting...');

    try {
      const subjectId = 17;
      const tierListName = "My Tier List";

      const itemMap = tierItems.reduce((acc, item) => {
        acc[item.name] = item.itemId;
        return acc;
      }, {});

      const rankMap = ranks.reduce((acc, rank) => {
        acc[rank.name] = rank.rankId;
        return acc;
      }, {});

      const assignments = tiers.map((tier) => {
        const itemName = tierAssignments[tier.name];
        const itemId = itemMap[itemName];
        const rankId = rankMap[tier.name];
        if (!itemId || !rankId) {
          throw new Error(`Missing ID for item "${itemName}" or rank "${tier.name}"`);
        }
        return { itemId, rankId };
      });

      const payload = {
        userId: userIdNum,
        subjectId,
        name: tierListName,
        assignments,
      };

      console.log('Submitting payload:', payload);

      const response = await axios.post(
        'http://localhost:8080/api/tierlists',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage('Submission successful');
      let formattedString = '';
      for (const tier of tiers) {
        formattedString += `${tier.name}: ${tierAssignments[tier.name]} | `;
      }
      setSubmissionString(formattedString);
    } catch (error) {
      console.error('Error submitting tier list:', error);
      if (error.response) {
        console.log('Backend error response:', error.response.data);
        setMessage(`Submission failed: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setMessage('Submission failed: No response from server');
      } else {
        setMessage(`Submission failed: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setMessage('Cancelled');
    setSubmissionString('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: '#333333',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '600px',
          padding: '20px',
          backgroundColor: '#555555',
          borderRadius: '10px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          {tiers.map((tier) => (
            <div key={tier.id} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
              <div
                style={{
                  width: '50px',
                  backgroundColor: getTierColor(tier.name),
                  color: 'black',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '50px',
                }}
              >
                {tier.name}
              </div>
              <div
                onDrop={(e) => {
                  const item = e.dataTransfer.getData('item');
                  if (item) handleDropToTier(tier.name, item);
                }}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  width: '200px',
                  height: '50px',
                  border: tierAssignments[tier.name] ? '1px solid black' : '1px dashed gray',
                  backgroundColor: tierAssignments[tier.name] ? '#ffffff' : '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '10px',
                }}
              >
                {tierAssignments[tier.name] ? (
                  <div
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('item', tierAssignments[tier.name])}
                    style={{
                      padding: '5px',
                      border: '1px solid gray',
                      backgroundColor: '#e0e0e0',
                      cursor: 'move',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <img
                      src={tierItems.find((item) => item.name === tierAssignments[tier.name])?.image}
                      alt={tierAssignments[tier.name]}
                      style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    />
                    <span>{tierAssignments[tier.name]}</span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          onDrop={(e) => {
            const item = e.dataTransfer.getData('item');
            if (item) handleDropToBottom(item);
          }}
          onDragOver={(e) => e.preventDefault()}
          style={{
            marginBottom: '5px',
            border: '1px dashed gray',
            minHeight: '90px',
            backgroundColor: '#f0f0f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              justifyContent: 'center',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {availableItems.map((item) => (
              <div
                key={item.name}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('item', item.name)}
                style={{
                  border: '1px solid gray',
                  backgroundColor: '#e0e0e0',
                  cursor: 'move',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: isSubmitting ? '#cccccc' : 'green',
              color: 'white',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            onClick={handleCancel}
            style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>

        {message && (
          <div
            style={{
              color: message === 'Submission successful' ? 'green' : 'red',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {message}
          </div>
        )}
        {submissionString && (
          <div style={{ color: 'white', textAlign: 'center', marginTop: '10px' }}>{submissionString}</div>
        )}
      </div>
    </div>
  );
};

export default TierList;