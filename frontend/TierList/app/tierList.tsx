import React, { useState } from 'react';

// tiers
const tiers = [
  { id: 1, name: 'S' },
  { id: 2, name: 'A' },
  { id: 3, name: 'B' },
  { id: 4, name: 'C' },
  { id: 5, name: 'D' },
  { id: 6, name: 'F' },
];

// temporary items
const initialItems = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6'];

const getTierColor = (tierName: string) => {
  switch (tierName) {
    case 'S': return '#00FF00'; // green
    case 'A': return '#ADFF2F'; // light green
    case 'B': return '#FFFF00'; // yellow
    case 'C': return '#FFA500'; // orange
    case 'D': return '#FF6347'; // ligh red
    case 'F': return '#FF0000'; // red
    default: return '#FFFFFF';
  }
};

const TierList = () => {
  const [tierAssignments, setTierAssignments] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>('');
  const [submissionString, setSubmissionString] = useState<string>('');

  // get available items
  const availableItems = initialItems.filter(
    (item) => !Object.values(tierAssignments).includes(item)
  );

  // dropping an item into a tier
  const handleDropToTier = (tierName: string, item: string) => {
    setTierAssignments((prev) => {
      const newAssignments = { ...prev };
      // remove the item from any other tier its assigned to
      for (const tier in newAssignments) {
        if (newAssignments[tier] === item) {
          delete newAssignments[tier];
        }
      }
      // assign the item to the new tier
      newAssignments[tierName] = item;
      return newAssignments;
    });
  };

  // handle dropping an item back to temporary items
  const handleDropToBottom = (item: string) => {
    setTierAssignments((prev) => {
      const newAssignments = { ...prev };
      for (const tier in newAssignments) {
        if (newAssignments[tier] === item) {
          delete newAssignments[tier];  // remove iteam
          break; // done
        }
      }
      return newAssignments;
    });
  };

  const handleSubmit = () => {
    const allTiersAssigned = tiers.every((tier) => tierAssignments[tier.name]);
    if (allTiersAssigned) {
      // create the formatted string
      let formattedString = '';
      for (const tier of tiers) {
        formattedString += `${tier.name}:${tierAssignments[tier.name]} | `;
      }
      setSubmissionString(formattedString);
      setMessage('Submission successful');
      
    } else {
      setSubmissionString('');
      setMessage('Failure');
    }
  };

  const handleCancel = () => {
    setMessage('Cancelled');
    setSubmissionString('');
  };

  return (
    <div
      style={{
        backgroundColor: '#333333', // dark gray background
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
          backgroundColor: '#555555', // lighter gray
          borderRadius: '10px',
        }}
      >
        {/* Tier List */}
        <div style={{ marginBottom: '20px' }}>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}
            >
              {/* Tier Label */}
              <div
                style={{
                  width: '50px',
                  backgroundColor: getTierColor(tier.name),
                  color: 'black',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '30px',
                }}
              >
                {tier.name}
              </div>
              {/* Item Slot */}
              <div
                onDrop={(e) => {
                  const item = e.dataTransfer.getData('item');
                  if (item) {
                    handleDropToTier(tier.name, item);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  width: '200px',
                  height: '30px',
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
                      padding: '10px',
                      border: '1px solid gray',
                      backgroundColor: '#e0e0e0',
                      cursor: 'move',
                    }}
                  >
                    {tierAssignments[tier.name]}
                  </div>
                ) : (
                  'Empty'
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Temporary Items */}
        <div
          onDrop={(e) => {
            const item = e.dataTransfer.getData('item');
            if (item) {
              handleDropToBottom(item);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          style={{
            marginBottom: '20px',
            padding: '10px',
            border: '1px dashed gray',
            minHeight: '100px',
            backgroundColor: '#f0f0f0',
          }}
        >
          <h3 style={{ textAlign: 'center' }}>Temporary Items</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {availableItems.map((item) => (
              <div
                key={item}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('item', item)}
                style={{
                  padding: '10px',
                  border: '1px solid gray',
                  backgroundColor: '#e0e0e0',
                  cursor: 'move',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>

        {/* Message */}
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
        {/* Submission String */}
        {submissionString && (
          <div
            style={{
              color: 'white',
              textAlign: 'center',
              marginTop: '10px',
            }}
          >
            {submissionString}
          </div>
        )}
      </div>
    </div>
  );
};

export default TierList;