import React, { useRef, useEffect, useState } from 'react';
import { Passenger, Driver } from '../../types/index';
import styles from './assigndrivermodal.module.css';

type AssignModalProps = {
  index: number;
  isOpen: boolean;
  close: () => void;
  ride: Passenger;
}

type DriverRowProps = {
  firstName: string;
  imageURL: string;
}

const DriverRow = ({ firstName, imageURL }: DriverRowProps) => (
  <div className={styles.driverRow}>
    <img className={styles.driverImage} src={imageURL} alt="Avatar"></img>
    <p className={styles.driverName}>{firstName}</p>
  </div>
);

const AssignDriverModal = ({ index, isOpen, close, ride }: AssignModalProps) => {
  // source: https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          close();
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const [drivers, setDrivers] = useState<Driver[]>([]);

  const getExistingDrivers = async () => {
    const driverData = await fetch('/drivers')
      .then((res) => res.json())
      .then((data) => data.data);
    setDrivers(driverData);
  };

  useEffect(() => {
    getExistingDrivers();
  }, []);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <>
      {isOpen
        && <div className={styles.modal} ref={wrapperRef}>
          <h1 className={styles.titleText}>Suggested Drivers</h1>
          {drivers.map((driver) => <DriverRow firstName={driver.firstName} imageURL='https://www.biography.com/.image/t_share/MTE5NDg0MDYwNjkzMjY3OTgz/terry-crews-headshot-600x600jpg.jpg' />)}
          <h1 className={styles.titleText}>Available Drivers</h1>
          {drivers.map((driver) => <DriverRow firstName={driver.firstName} imageURL='https://www.biography.com/.image/t_share/MTE5NDg0MDYwNjkzMjY3OTgz/terry-crews-headshot-600x600jpg.jpg' />)}
        </div>
      }
    </>
  );
};

export default AssignDriverModal;
