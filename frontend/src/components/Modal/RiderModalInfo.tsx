import React from 'react';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import { Button, Input, Label } from '../FormElements/FormElements';
import styles from './ridermodal.module.css';
import { ObjectType, Accessibility, Rider } from '../../types/index';

type ModalFormProps = {
  onSubmit: (data: ObjectType) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<ObjectType>>;
  rider?: Rider;
};

const RiderModalInfo = ({
  onSubmit,
  setIsOpen,
  setFormData,
  rider,
}: ModalFormProps) => {
  const { register, formState, handleSubmit, getValues } = useForm({
    defaultValues: {
      firstName: rider?.firstName ?? '',
      lastName: rider?.lastName ?? '',
      netid: rider?.email.split('@')[0] ?? '',
      phoneNumber: rider?.phoneNumber ?? '',
      needs: rider?.accessibility.join(','), // if no needs, default is undefined
      address: rider?.address ?? '',
      joinDate: rider?.joinDate ?? '',
      endDate: rider?.endDate ?? '',
    },
  });
  const { errors } = formState;
  const beforeSubmit = ({
    firstName,
    lastName,
    netid,
    phoneNumber,
    needs,
    address,
    joinDate,
    endDate,
  }: ObjectType) => {
    const email = netid ? `${netid}@cornell.edu` : undefined;
    const accessibility = needs.split(',').map((n: string) => n.trim());
    onSubmit({
      firstName,
      lastName,
      email,
      phoneNumber,
      accessibility,
      address,
      joinDate,
      endDate,
    });
  };

  const cancel = () => {
    setFormData({});
    setIsOpen(false);
  };

  const localUserType = localStorage.getItem('userType');
  const isEditing = rider !== undefined;
  const isStudentEditing = isEditing && localUserType === 'Rider';

  return (
    <form onSubmit={handleSubmit(beforeSubmit)} className={styles.form}>
      <div className={cn(styles.inputContainer, styles.rideTime)}>
        <div className={cn(styles.gridR1, styles.gridCSmall1)}>
          <Label className={styles.label} htmlFor="firstName">
            First Name:{' '}
          </Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            ref={register({ required: true })}
            className={styles.firstRow}
          />
          {errors.firstName && (
            <p className={styles.error}>Please enter a name</p>
          )}
          <Label className={styles.label} htmlFor="lastName">
            Last Name:{' '}
          </Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            ref={register({ required: true })}
            className={styles.firstRow}
          />
          {errors.lastName && (
            <p className={styles.error}>Please enter a name</p>
          )}
        </div>
        <div className={cn(styles.gridR1, styles.gridCSmall2)}>
          <Label className={styles.label} htmlFor="netid">
            NetID:{' '}
          </Label>
          <Input
            id="netid"
            name="netid"
            type="text"
            ref={register({ required: true, pattern: /^[a-zA-Z]+[0-9]+$/ })}
            disabled={isStudentEditing}
            className={styles.firstRow}
          />
          {errors.netid && <p className={styles.error}>Please enter a netid</p>}
        </div>
        <div className={cn(styles.gridR1, styles.gridCSmall3)}>
          <Label className={styles.label} htmlFor="phoneNumber">
            Phone Number:{' '}
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            ref={register({ required: true, pattern: /^[0-9]{10}$/ })}
            className={styles.firstRow}
          />
          {errors.phoneNumber && (
            <p className={styles.error}>Please enter a phone number</p>
          )}
        </div>
        <div className={cn(styles.gridR2, styles.gridCBig1)}>
          <Label className={styles.label} htmlFor="needs">
            Needs:{' '}
          </Label>
          <Input
            id="needs"
            name="needs"
            type="text"
            ref={register({
              validate: (needs) => {
                if (needs === '') {
                  return true;
                }
                const needsArr = needs.split(',').map((n: string) => n.trim());
                const isValidNeed = (acc: boolean, val: Accessibility) =>
                  acc && Object.values(Accessibility).includes(val);
                return needsArr.reduce(isValidNeed, true);
              },
            })}
          />
          {errors.needs?.type === 'validate' && (
            <p className={styles.error}>
              Invalid needs. You can enter 'Assistant', 'Crutches', or
              'Wheelchair'
            </p>
          )}
        </div>
        <div className={cn(styles.gridR2, styles.gridCBig2)}>
          <Label className={styles.label} htmlFor="address">
            Address:{' '}
          </Label>
          <Input
            id="address"
            name="address"
            type="text"
            ref={register({
              required: true,
              pattern: /^[a-zA-Z0-9\s,.'-]{3,}$/,
            })}
          />
          {errors.address && (
            <p className={styles.error}>Please enter an address</p>
          )}
        </div>
        <div className={cn(styles.gridR3, styles.gridCAll)}>
          <p>Duration</p>
          <div className={styles.lastRow}>
            <div>
              <Label className={styles.label} htmlFor="joinDate">
                Join Date:{' '}
              </Label>
              <Input
                id="joinDate"
                type="date"
                name="joinDate"
                ref={register({ required: true })}
                disabled={isStudentEditing}
                className={styles.riderDate}
              />
              {errors.joinDate && (
                <p className={styles.error}>Please enter a join date</p>
              )}
            </div>
            <p className={styles.to}>to</p>
            <div>
              <Label className={styles.label} htmlFor="endDate">
                End Date:{' '}
              </Label>
              <Input
                id="endDate"
                type="date"
                name="endDate"
                ref={register({
                  required: true,
                  validate: (endDate) => {
                    const joinDate = getValues('joinDate');
                    return joinDate < endDate;
                  },
                })}
                disabled={isStudentEditing}
                className={styles.riderDate}
              />
              {errors.endDate?.type === 'required' && (
                <p className={styles.error}>Please enter an end date</p>
              )}
              {errors.endDate?.type === 'validate' && (
                <p className={styles.error}>Invalid end time</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          type="button"
          className={styles.cancel}
          outline={true}
          onClick={() => cancel()}
        >
          Cancel
        </Button>
        <Button type="submit" className={styles.submit}>
          {isEditing ? 'Edit a Student' : 'Add a Student'}
        </Button>
      </div>
    </form>
  );
};

export default RiderModalInfo;
