import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity,StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from "expo-image";
import { useFonts } from "expo-font";

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
    case 'S': return '#0CCE6B';
    case 'A': return '#91CF4C';
    case 'B': return '#ffcf33';
    case 'C': return '#f07b16';
    case 'D': return '#e1342c';
    case 'F': return '#a51e17';
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
  const [tierlistId, setTierlistId] = useState(null);
  const [subjectName, setSubjectName] = useState('');

  const [fontsLoaded] = useFonts({
    "Silverknife-RegularItalic": require("@/assets/fonts/Silverknife-RegularItalic.otf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const landingLogo = require("@/assets/images/HotTakesLogoWithRightText.png");
  const footerLogo = require("@/assets/images/CSUMB-COS-Logo.png");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tierItemsRes, ranksRes, subjectRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/tieritems/subject/${subjectId}`),
          axios.get(`http://localhost:8080/api/itemranks`),
          axios.get(`http://localhost:8080/api/subjects/${subjectId}`),
        ]);

        setTierItems(tierItemsRes.data);
        setRanks(ranksRes.data);
        setSubjectName(subjectRes.data.name);

        // Check for existing tier list
        let existingTierList = null;
        try {
          const existingTierListRes = await axios.get(
            `http://localhost:8080/api/tierlists/user/${userID}/subject/${subjectId}`
          );
          existingTierList = existingTierListRes.data;
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // No existing tier list found, proceed with empty assignments
          } else {
            console.error('Error fetching existing tier list:', error);
            setMessage('Failed to load existing tier list');
          }
        }

        if (existingTierList) {
          const assignments = {};
          existingTierList.assignments.forEach((assignment) => {
            const rank = ranksRes.data.find((r) => r.rankId === assignment.rankId);
            const item = tierItemsRes.data.find((i) => i.itemId === assignment.itemId);
            if (rank && item) {
              assignments[rank.name] = item.name;
            }
          });
          setTierAssignments(assignments);
          setTierlistId(existingTierList.tierList.tierlistId);
        } else {
          setTierAssignments({});
          setTierlistId(null);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setMessage('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userID, subjectId]);

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
      const tierListName = "My Tier List"; // Can be made dynamic if needed

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
        subjectId: parseInt(subjectId, 10),
        name: tierListName,
        assignments,
      };

      let response;
      if (tierlistId) {
        // Update existing tier list with PUT request
        response = await axios.put(
          `http://localhost:8080/api/tierlists/${tierlistId}`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Create new tier list with POST request
        response = await axios.post(
          'http://localhost:8080/api/tierlists',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
        setTierlistId(response.data.tierlistId); // Store the new tierlistId
      }

      setMessage('Submission successful');
      let formattedString = '';
      for (const tier of tiers) {
        formattedString += `${tier.name}: ${tierAssignments[tier.name]} | `;
      }
      setSubmissionString(formattedString);
    } catch (error) {
      console.error('Error submitting tier list:', error);
      if (error.response) {
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
    router.push(`/landing?userID=${encodeURIComponent(userID)}`);
  };

  const handleHome = useCallback(() => {
    if (router.pathname !== "/landing") {
      router.push(`/landing?userID=${encodeURIComponent(userID)}`);
    }
  }, [userID]);

  // Viewing Tier lists
  const handleTierLists = useCallback(() => {
    if (router.pathname !== "/viewCurrentSubjects") {
      router.push(`/viewCurrentSubjects?userID=${encodeURIComponent(userID)}`);
    }
  }, [userID]);

  // View Settings Functionality
  const handleSettings = useCallback(() => {
    if (router.pathname !== "/settings") {
      router.push(`/settings?userID=${encodeURIComponent(userID)}`);
    }
  }, [userID]);

  // Logout Functionality
  const handleLogout = () => {
    router.dismissAll();
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#1f2022',
        minHeight: '100vh',
        overflow: "scroll",
      }}
    >
      <View>
        <View style={styles.headerContainer}>
          <Image
            source={landingLogo}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navButton} onPress={handleHome}>
            Home
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleTierLists}>
            Create new Tier List
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleSettings}>
            Settings
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleLogout}>
            Log Out
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tierListCard}>
        <Text style={styles.subjectHeader}>RANK: {subjectName.toUpperCase()}</Text>
        <div
          style={{
            width: '600px',
            padding: '20px',
            backgroundColor: '#131515',
            borderRadius: '10px',
            marginTop: '20px', // Adds margin between the navbar and the content
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            {tiers.map((tier) => (
              <div key={tier.id} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                <div
                  style={{
                    width: '50px',
                    backgroundColor: getTierColor(tier.name),
                    color: '#0a0a0a',
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
                    border: tierAssignments[tier.name] ? '1px solid #0a0a0a' : '1px dashed #4E5056',
                    backgroundColor: tierAssignments[tier.name] ? '#fcfcfc' : '#fcfcfc',
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
                        border: '1px solid #4E5056',
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
              border: '1px dashed #4E5056',
              minHeight: '90px',
              backgroundColor: '#fcfcfc',
            }}
          >
            <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#0a0a0a', padding: '5px' }}>
            </div>
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
                    border: '1px solid #4E5056',
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
                backgroundColor: isSubmitting ? '#cccccc' : '#0CCE6B',
                color: 'white',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              onClick={handleCancel}
              style={{ padding: '10px 20px', backgroundColor: '#e1342c', color: '#fcfcfc', border: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
    
          {message && (
            <div
              style={{
                color: message === 'Submission successful' ? '#0CCE6B' : '#e1342c',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {message}
            </div>
          )}
          {/* {submissionString && (
            <div style={{ color: '#fcfcfc', textAlign: 'center', marginTop: '10px' }}>{submissionString}</div>
          )} */}
        </div>
      </View>
  
      {/* Footer */}
      <View style={styles.footer}>
        <Image
          source={footerLogo}
          style={styles.footerImage}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>
          CST438 2025© Jayson Basilio, Julio Fernandez, Ozzie Munoz, Ahmed Torki
          <br />
          Tier List Project 02 - Hot Takes
        </Text>
      </View>
    </div>
  );  
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f2022",
  },
  container: {
    flex: 1,
    backgroundColor: "#1f2022",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  logoImage: {
    width: "18%",
    height: undefined,
    aspectRatio: 2.5,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "#0a0a0a",
  },
  navButton: {
    paddingHorizontal: 15,
    color: "#fcfcfc",
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  tierListCard: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    paddingBottom: "5%",
  },
  subjectHeader: {
    fontSize: 50,
    color: "#ffcf33",
    textAlign: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 5,
    fontFamily: "Silverknife-RegularItalic",
    letterSpacing: 2,
  },
  footer: {
    backgroundColor: "#b5c8da",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderTopColor: "#fcfcfc",
    marginTop: "auto",
  },
  footerImage: {
    width: 125,
    height: 40,
    marginBottom: 5,
    resizeMode: "contain",
  },
  footerText: {
    color: "#31456b",
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "Arial",
  },
});

export default TierList;