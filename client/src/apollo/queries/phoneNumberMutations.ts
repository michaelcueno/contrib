import { gql } from '@apollo/client';

export const ConfirmPhoneNumberMutation = gql`
  mutation EnterPhoneNumber($phoneNumber: String!, $otp: String!) {
    confirmAccountWithPhoneNumber(phoneNumber: $phoneNumber, otp: $otp) {
      id
      phoneNumber
      status
      influencerProfile {
        id
      }
    }
  }
`;

export const ConfirmPhoneNumberWithInvitationMutation = gql`
  mutation EnterPhoneNumber($code: String!, $otp: String!) {
    confirmAccountWithInvitation(code: $code, otp: $otp) {
      id
      phoneNumber
      status
      influencerProfile {
        id
      }
    }
  }
`;

export const ResendOtpMutation = gql`
  mutation ResendOtp($phoneNumber: String!) {
    createAccountWithPhoneNumber(phoneNumber: $phoneNumber) {
      id
      phoneNumber
      status
      influencerProfile {
        id
      }
    }
  }
`;

export const ResendOtpWithInvitationMutation = gql`
  mutation ResendOtp($code: String!) {
    createAccountWithInvitation(code: $code) {
      id
      phoneNumber
      status
      influencerProfile {
        id
      }
    }
  }
`;