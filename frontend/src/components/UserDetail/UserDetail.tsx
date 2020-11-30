import React from 'react';
import styles from './userDetail.module.css';
import { edit } from "../../icons/other/index";

type otherInfo = {
  children: JSX.Element | JSX.Element[];
}

export const OtherInfo = ({ children }: otherInfo) => (
  <div className={styles.otherInfoContainer}>
    {children}
  </div>
)

type UserContactInfo = {
  icon: string;
  alt: string;
  text: string;
};

export const UserContactInfo = ({ icon, alt, text }: UserContactInfo) => (
  <div className={styles.contactInfo}>
    <img className={styles.contactIcon} src={icon} alt={alt} />
    <p className={styles.contactText}>{text}</p>
  </div>
);

type UserDetailProps = {
  // profilePic: string;
  firstName: string;
  lastName: string;
  netId: string;
  children: JSX.Element | JSX.Element[];
}

const UserDetail = ({
  firstName,
  lastName,
  netId,
  children
}: UserDetailProps) => {
  const fullName = firstName + " " + lastName;
  return (
    <div className={styles.userDetail}>
      <div className={styles.imgContainer}>
        {/* <img className={styles.profilePic} src={user.profilePic} /> */}
      </div>
      <div className={styles.basicInfoContainer}>
        <p className={styles.name}>{fullName}</p>
        <p className={styles.netId}>{netId}</p>
        <img className={styles.edit} src={edit} />
        <div className={styles.contactInfoContainer}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default UserDetail;