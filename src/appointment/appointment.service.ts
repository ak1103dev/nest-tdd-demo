import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.model';
import { PatientService } from '../patient/patient.service';

export interface AppointmentInput {
  patientId: number;
  startTime: Date;
  endTime: Date;
}

@Injectable()
export class AppointmentService {
  constructor(private patientService: PatientService) {}
  public async scheduleAppointment(
    appointmentData: AppointmentInput,
  ): Promise<Appointment> {
    if (appointmentData.endTime <= appointmentData.startTime) {
      throw new Error("appointment's endTime should be after startTime");
    }

    if (
      appointmentData.endTime.getUTCDate() !==
      appointmentData.startTime.getUTCDate()
    ) {
      throw new Error(
        "appointment's endTime should be in the same day as start time's",
      );
    }

    const patientExists = await this.patientService.doesPatientExist(
      appointmentData.patientId,
    );
    if (!patientExists) {
      throw new Error('Patient does not exist');
    }

    return {
      ...appointmentData,
      confirmed: false,
    };
  }
}
