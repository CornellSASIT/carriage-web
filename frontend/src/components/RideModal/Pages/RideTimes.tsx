import React, { useEffect } from 'react';
import { useForm, useFormContext, FormProvider } from 'react-hook-form';
import cn from 'classnames';
import moment from 'moment';
import { ModalPageProps } from '../../Modal/types';
import { Button, Input, Label, Select } from '../../FormElements/FormElements';
import styles from '../ridemodal.module.css';
import { useDate } from '../../../context/date';
import { ObjectType } from '../../../types/index';

import { useWeek } from '../../EmployeeModal/WeekContext';

type AvailabilityInputProps = {
  index: number;
  existingTimeRange?: string;
  existingDayArray?: string[];
}

const AvailabilityInput = ({
  index,
  existingDayArray,
}: AvailabilityInputProps) => {
  const {
    selectDay,
    deselectDay,
    isDaySelectedByInstance,
    getSelectedDays,
  } = useWeek();
  const { register, setValue, formState, unregister } = useFormContext();
  const { errors } = formState;
  const dayLabels: ObjectType = {
    Mon: 'M',
    Tue: 'T',
    Wed: 'W',
    Thu: 'T',
    Fri: 'F',
  };
  const fieldName = 'recurringDays';
  const days = getSelectedDays(index);
  const handleClick = (day: string) => {
    if (isDaySelectedByInstance(day, index)) {
      deselectDay(day);
    } else {
      selectDay(day, index);
    }
  };

  const prefillDays = (): void => {
    existingDayArray?.forEach((day) => {
      selectDay(day, index);
    });
  };

  useEffect(() => {
    // Clear previously selected
    if (days.length) {
      days.forEach(deselectDay);
    }
    // Register input
    register(fieldName, {
      validate: (recurringDays) => Boolean(recurringDays?.length),
    });
    // Prefill days and time range once
    prefillDays();
    // On unmount, unregister recurringDays and endDate
    return () => {
      unregister([fieldName, 'endDate']);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // When selected days changes, update days value
    setValue(fieldName, days);
  }, [days, setValue]);

  return (
    <div className={styles.availabilityInput}>
      <p className={styles.repeatText}>Repeats on:</p>
      <div className={styles.timeFlexbox}>
        <div className={styles.daysBox}>
          {Object.entries(dayLabels).map(([day, label]) => (
            <Input
              key={day}
              name={fieldName}
              type="button"
              value={label}
              className={cn(
                styles.day,
                { [styles.daySelected]: isDaySelectedByInstance(day, index) },
              )}
              onClick={() => handleClick(day)}
            />
          ))}
        </div>
        {errors.recurringDays && (
          <p className={cn(styles.error, styles.dayError)}>Please select at least one day</p>
        )}
      </div>
    </div>
  );
};

const RideTimesPage = ({ formData, onSubmit }: ModalPageProps) => {
  const { curDate } = useDate();
  const methods = useForm({
    defaultValues: {
      date: formData?.date ?? moment(curDate).format('YYYY-MM-DD'),
      pickupTime: formData?.pickupTime ?? '',
      dropoffTime: formData?.dropoffTime ?? '',
      recurring: formData?.recurring ?? '',
      endDate: formData?.endDate ?? '',
    },
  });
  const { register, formState, handleSubmit, getValues, watch } = methods;
  const { errors } = formState;
  const watchDate = watch('date');
  const watchCustomRepeat = watch('recurring');
  const isCustomRepeating = watchCustomRepeat === 'Custom';

  console.log(errors);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={cn(styles.inputContainer, styles.rideTime)}>
          <div className={styles.date}>
            <Label htmlFor="date">Date:</Label>
            <Input
              id="date"
              type="date"
              name="date"
              ref={register({
                required: true,
                validate: (date) => {
                  const fmtDate = moment(date).format('YYYY-MM-DD');
                  const fmtCurr = moment().format('YYYY-MM-DD');
                  return fmtDate >= fmtCurr;
                },
              })}
            />
            {errors.date?.type === 'required' && (
              <p className={styles.error}>Please enter a date</p>
            )}
            {errors.date?.type === 'validate' && (
              <p className={styles.error}>Invalid date</p>
            )}
          </div>
          <div className={styles.repeating}>
            <Select className={styles.repeatingSelect}
              name="recurring"
              ref={register({ required: true })}
            >
              <option value="Does Not Repeat" className={styles.repeatingOption} selected>
                Does Not Repeat
              </option>
              <option value="Daily" className={styles.repeatingOption}>
                Daily
              </option>
              <option value="Weekly" className={styles.repeatingOption}>
                Weekly on {moment(watchDate).format('dddd')}
              </option>
              <option value="Custom" className={styles.repeatingOption}>
                Custom
              </option>
            </Select>
          </div>
          {isCustomRepeating && (
            <div className={styles.customRepeatContainer}>
              <AvailabilityInput
                key={0}
                index={0}
                existingDayArray={formData?.recurringDays}
              />
              <div className={styles.endsContainer}>
                <Label htmlFor="endDate">Ends:</Label>
                <Input
                  id="date"
                  type="date"
                  name="endDate"
                  ref={register({
                    required: isCustomRepeating,
                    validate: (date) => {
                      const fmtDate = moment(date).format('YYYY-MM-DD');
                      const fmtCurr = moment().format('YYYY-MM-DD');
                      return fmtDate >= fmtCurr;
                    },
                  })}
                />
                {errors.endDate?.type === 'required' && (
                  <p className={styles.error}>Please enter a date</p>
                )}
                {errors.endDate?.type === 'validate' && (
                  <p className={styles.error}>Invalid date</p>
                )}
              </div>
            </div>
          )}
          <div className={styles.pickupTime}>
            <Label htmlFor="pickupTime">Pickup time:</Label>
            <Input
              id="pickupTime"
              type="time"
              name="pickupTime"
              ref={register({
                required: true,
                validate: (pickupTime) => {
                  const date = getValues('date');
                  return moment().isBefore(moment(`${date} ${pickupTime}`));
                },
              })}
            />
            {errors.pickupTime?.type === 'required' && (
              <p className={styles.error}>Please enter a time</p>
            )}
            {errors.pickupTime?.type === 'validate' && (
              <p className={styles.error}>Invalid time</p>
            )}
          </div>
          <div className={styles.dropoffTime}>
            <Label htmlFor="dropoffTime">Dropoff time:</Label>
            <Input
              id="dropoffTime"
              type="time"
              name="dropoffTime"
              ref={register({
                required: true,
                validate: (dropoffTime) => {
                  const pickupTime = getValues('pickupTime');
                  return pickupTime < dropoffTime;
                },
              })}
            />
            {errors.dropoffTime?.type === 'required' && (
              <p className={styles.error}>Please enter a time</p>
            )}
            {errors.dropoffTime?.type === 'validate' && (
              <p className={styles.error}>Invalid time</p>
            )}
          </div>
        </div>
        <Button type="submit">Next</Button>
      </form>
    </FormProvider>
  );
};

export default RideTimesPage;
