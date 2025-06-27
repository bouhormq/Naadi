import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Categories from './Categories';
import { Calendar } from 'react-native-calendars';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (searchData: {
    activity: string;
    location: string;
    date: string;
    time: string;
  }) => void;
}

const subCategoriesData = [
  {
    category: 'Motors & Watercraft',
    items: [
      { name: 'Scooter', emoji: '🛴' },
      { name: 'Motorbike', emoji: '🏍️' },
      { name: 'Quad', emoji: '🚜' },
      { name: 'Buggy', emoji: '🚙' },
      { name: 'Jet Ski', emoji: '🚤' },
      { name: 'Boat', emoji: '⛵' },
      { name: 'Kayak', emoji: '🛶' },
      { name: 'Paddleboard', emoji: '🏄‍♀️' },
    ],
  },
  {
    category: 'Fitness',
    items: [
      { name: 'Yoga', emoji: '🧘‍♀️' },
      { name: 'HIIT', emoji: '🏋️‍♀️' },
      { name: 'Martial Arts', emoji: '🥋' },
      { name: 'Rowing', emoji: '🚣‍♀️' },
      { name: 'Running', emoji: '🏃‍♀️' },
      { name: 'Cycling', emoji: '🚴‍♀️' },
      { name: 'Pilates', emoji: '🤸‍♀️' },
      { name: 'Dance', emoji: '💃' },
      { name: 'Boxing', emoji: '🥊' },
      { name: 'Outdoors', emoji: '🌳' },
      { name: 'Gym Time', emoji: '💪' },
      { name: 'Sports', emoji: '🏀' },
    ],
  },
  {
    category: 'Wellness',
    items: [
      { name: 'Massage', emoji: '💆‍♀️' },
      { name: 'Facial', emoji: '🧖‍♀️' },
      { name: 'Sports Recovery', emoji: '🧊' },
      { name: 'Hammam', emoji: '🛁' },
      { name: 'Meditation', emoji: '🧘‍♂️' },
      { name: 'Acupuncture', emoji: '📌' },
      { name: 'Cupping', emoji: '💨' },
    ],
  },
  {
    category: 'Beauty',
    items: [
      { name: 'Nails', emoji: '💅' },
      { name: 'Hair', emoji: '💇‍♀️' },
      { name: 'Lashes', emoji: '👁️' },
      { name: 'Brows', emoji: '✏️' },
    ],
  },
];

const allActivities = subCategoriesData.flatMap((category) => category.items);

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  onSearch,
}) => {
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [activityQuery, setActivityQuery] = useState('');
  const [previousActivityQuery, setPreviousActivityQuery] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(
    null
  );
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Any date');
  const [activeDateButton, setActiveDateButton] = useState('Any date');
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Any time');
  const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Current location');
  const [locationQuery, setLocationQuery] = useState('');

  const handleClear = () => {
    setActivityQuery('');
    setPreviousActivityQuery('');
    setSelectedCategoryName(null);
    setSelectedDate('Any date');
    setActiveDateButton('Any date');
    setSelectedTime('Any time');
    setSelectedLocation('Current location');
    setLocationQuery('');
  };

  const locations = [
    'Tetouan',
    'Martil',
    "M'diq",
    'Fnidek',
    'Marina Smir',
    'Cabo Negro',
  ];

  const DateTypeButton = ({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.dateTypeButton, selected && styles.dateTypeButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.dateTypeButtonText, selected && styles.dateTypeButtonTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  const getFormattedDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const toYyyyMmDd = (dateStr: string) => {
    if (!dateStr || dateStr === 'Any date') return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = getFormattedDate(today);
  const tomorrowStr = getFormattedDate(tomorrow);

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = String(h).padStart(2, '0');
        const minute = String(m).padStart(2, '0');
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleCloseOrBack = () => {
    if (isLocationPickerVisible) {
      setLocationPickerVisible(false);
      setLocationQuery('');
    } else if (isTimePickerVisible) {
      setTimePickerVisible(false);
    } else if (isCalendarVisible) {
      setCalendarVisible(false);
    } else if (showAllActivities) {
      if (selectedCategoryName) {
        setActivityQuery(previousActivityQuery);
      } else {
        const isActivitySelected = allActivities.some(
          (activity) => activity.name === activityQuery
        );
        if (!isActivitySelected) {
          setActivityQuery('');
        }
      }
      setShowAllActivities(false);
      setSelectedCategoryName(null);
    } else {
      onClose();
      handleClear();
    }
  };

  const activitiesToShow =
    selectedCategoryName
      ? subCategoriesData.find((c) => c.category === selectedCategoryName)?.items ||
        []
      : allActivities;

  const filteredActivities = activitiesToShow.filter((activity) =>
    activity.name.toLowerCase().includes(activityQuery.toLowerCase())
  );

  const handleCategorySelect = (category: string) => {
    setPreviousActivityQuery(activityQuery);
    setActivityQuery('');
    setSelectedCategoryName(category);
    setShowAllActivities(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleCloseOrBack}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={handleCloseOrBack}
            style={[
              styles.closeButton,
              (showAllActivities || isCalendarVisible || isTimePickerVisible || isLocationPickerVisible) && { alignSelf: 'flex-start' },
            ]}
          >
            <Ionicons
              name={showAllActivities || isCalendarVisible || isTimePickerVisible || isLocationPickerVisible ? 'arrow-back' : 'close'}
              size={28}
              color="black"
            />
          </TouchableOpacity>
          <ScrollView>
            {isLocationPickerVisible ? (
              <View>
                <Text style={styles.headerTitle}>Select location</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color="gray"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Search for a location"
                    placeholderTextColor="black"
                    style={styles.input}
                    value={locationQuery}
                    onChangeText={setLocationQuery}
                    autoFocus
                  />
                  {locationQuery ? (
                    <TouchableOpacity onPress={() => setLocationQuery('')}>
                      <Ionicons name="close-circle" size={24} color="gray" />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={styles.timeSlotsContainer}>
                  {locations
                    .filter((loc) =>
                      loc.toLowerCase().includes(locationQuery.toLowerCase())
                    )
                    .map((location) => (
                      <TouchableOpacity
                        key={location}
                        style={[
                          styles.timeSlot,
                          selectedLocation === location &&
                            styles.timeSlotSelected,
                        ]}
                        onPress={() => {
                          setSelectedLocation(location);
                          setLocationPickerVisible(false);
                          setLocationQuery('');
                        }}
                      >
                        <Text
                          style={[
                            styles.timeSlotText,
                            selectedLocation === location &&
                              styles.timeSlotTextSelected,
                          ]}
                        >
                          {location}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            ) : isTimePickerVisible ? (
              <View>
                <Text style={styles.headerTitle}>Select time</Text>
                <View style={styles.timeSlotsContainer}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.timeSlotSelected,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTime === time && styles.timeSlotTextSelected,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : isCalendarVisible ? (
              <View>
                <Text style={styles.headerTitle}>Date</Text>
                <View style={styles.dateTypeContainer}>
                  <DateTypeButton
                    label="Any date"
                    selected={activeDateButton === 'Any date'}
                    onPress={() => {
                      setActiveDateButton('Any date');
                      setSelectedDate('Any date');
                    }}
                  />
                  <DateTypeButton
                    label="Today"
                    selected={activeDateButton === 'Today'}
                    onPress={() => {
                      setActiveDateButton('Today');
                      setSelectedDate(todayStr);
                    }}
                  />
                  <DateTypeButton
                    label="Tomorrow"
                    selected={activeDateButton === 'Tomorrow'}
                    onPress={() => {
                      setActiveDateButton('Tomorrow');
                      setSelectedDate(tomorrowStr);
                    }}
                  />
                </View>
                <Calendar
                  minDate={toYyyyMmDd(getFormattedDate(today))}
                  onDayPress={(day) => {
                    const [year, month, dayOfMonth] = day.dateString.split('-');
                    const formatted = `${dayOfMonth}-${month}-${year}`;
                    setSelectedDate(formatted);
                    if (formatted === todayStr) {
                      setActiveDateButton('Today');
                    } else if (formatted === tomorrowStr) {
                      setActiveDateButton('Tomorrow');
                    } else {
                      setActiveDateButton('Any date');
                    }
                  }}
                  markedDates={{
                    [toYyyyMmDd(selectedDate)]: {
                      selected: true,
                      disableTouchEvent: true,
                    },
                  }}
                  theme={{
                    selectedDayBackgroundColor: '#3674B5',
                    selectedDayTextColor: 'white',
                    todayTextColor: 'black',
                    arrowColor: 'black',
                  }}
                />
              </View>
            ) : showAllActivities ? (
              <View>
                <Text style={styles.headerTitle}>
                  {selectedCategoryName || 'Treatment or Venue'}
                </Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color="gray"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Activity or venue"
                    placeholderTextColor="black"
                    style={styles.input}
                    value={activityQuery}
                    onChangeText={setActivityQuery}
                    autoFocus
                  />
                  {activityQuery ? (
                    <TouchableOpacity onPress={() => setActivityQuery('')}>
                      <Ionicons name="close-circle" size={24} color="gray" />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {filteredActivities.map((activity) => (
                  <TouchableOpacity
                    key={activity.name}
                    style={styles.activityRow}
                    onPress={() => {
                      setActivityQuery(activity.name);
                      setShowAllActivities(false);
                      setSelectedCategoryName(null);
                    }}
                  >
                    <View style={styles.emojiContainer}>
                      <Text style={styles.emoji}>{activity.emoji}</Text>
                    </View>
                    <Text style={styles.activityName}>{activity.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color="gray"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Activity or venue"
                    placeholderTextColor="black"
                    style={styles.input}
                    value={activityQuery}
                    onChangeText={setActivityQuery}
                    onFocus={() => {
                      setSelectedCategoryName(null);
                      setShowAllActivities(true);
                    }}
                  />
                  {activityQuery ? (
                    <TouchableOpacity onPress={() => setActivityQuery('')}>
                      <Ionicons name="close-circle" size={24} color="gray" />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setLocationPickerVisible(true)}
                >
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color="gray"
                    style={styles.inputIcon}
                  />
                  <View
                    style={{
                      flex: 1,
                      height: 50,
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{selectedLocation}</Text>
                  </View>
                  {selectedLocation !== 'Current location' && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedLocation('Current location');
                      }}
                    >
                      <Ionicons name="close-circle" size={24} color="gray" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                <View style={styles.dateContainer}>
                  <TouchableOpacity style={styles.dateInput} onPress={() => setCalendarVisible(true)}>
                    <Ionicons name="calendar-outline" size={24} color="gray" style={styles.inputIcon} />
                    <Text style={styles.dateText}>{selectedDate}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dateInput} onPress={() => setTimePickerVisible(true)}>
                    <Ionicons name="time-outline" size={24} color="gray" style={styles.inputIcon} />
                    <Text style={styles.dateText}>{selectedTime}</Text>
                  </TouchableOpacity>
                </View>
                <Categories
                  variant="modal"
                  onCategorySelect={handleCategorySelect}
                />
              </>
            )}
          </ScrollView>
          {(isCalendarVisible || isTimePickerVisible || isLocationPickerVisible) && (
            <View style={styles.footer}>
              <TouchableOpacity style={styles.clearButton} onPress={() => {
                if (isCalendarVisible) {
                  setActiveDateButton('Any date');
                  setSelectedDate('Any date');
                } else if (isTimePickerVisible) {
                  setSelectedTime('Any time');
                } else if (isLocationPickerVisible) {
                  setLocationQuery('');
                  setSelectedLocation('Current location');
                }
              }}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneButton} onPress={() => {
                if (isCalendarVisible) {
                  setCalendarVisible(false);
                } else if (isTimePickerVisible) {
                  setTimePickerVisible(false);
                } else if (isLocationPickerVisible) {
                  setLocationPickerVisible(false);
                }
              }}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          {!(showAllActivities || isCalendarVisible || isTimePickerVisible || isLocationPickerVisible) && (
            <View style={styles.footer}>
              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => {
                  onSearch({
                    activity: activityQuery,
                    location: selectedLocation,
                    date: selectedDate,
                    time: selectedTime,
                  });
                }}
              >
                <Text style={styles.doneButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '90%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  doneButton: {
    paddingVertical: 14,
    paddingHorizontal: 55,
    borderRadius: 12,
    backgroundColor: 'black',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '48%',
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 15,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emoji: {
    fontSize: 20,
  },
  activityName: {
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearButton: {
    paddingVertical: 14,
    paddingHorizontal: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  clearButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  dateTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  dateTypeButtonSelected: {
    backgroundColor: '#3674B5',
    borderBlockColor: '#3674B5',
  },
  dateTypeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  dateTypeButtonTextSelected: {
    color: 'white',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  timeSlotSelected: {
    backgroundColor: 'black',
  },
  timeSlotText: {
    color: 'black',
    textAlign: 'center',
  },
  timeSlotTextSelected: {
    color: 'white',
  },
});

export default SearchModal;
