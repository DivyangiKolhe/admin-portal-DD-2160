export const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, "");
};

export const directoryStructure = {
  id: 'assets',
  name: 'assets',
  children: [
    {
      id: 'faqs',
      name: 'faqs',
      children: [
        {
          id: 'teleconsulation',
          name: 'teleconsulation',
          children: [
            { id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/faqs/teleconsultation/doctor.json', name: 'doctor.json' },
            { id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/faqs/teleconsultation/user.json', name: 'user.json' },
          ],
        },
        {
          id: 'transaction',
          name: 'transaction',
          children: [
            { id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/faqs/transactions/payment_policies.json', name: 'payment_policies.json' },
            { id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/faqs/transactions/payment_refund_policies.json', name: 'payment_refund_policies' },
          ],
        },
      ],
    },
    {
      id: 'metadata',
      name: 'metadata',
      children: [
        { id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/metadata/bank-name.json', name: 'bank-name.json' },
        {
          id: 'brain-games',
          name: 'brain-games',
          children: [{ id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/metadata/brain-games/animalMapping.json', name: 'animalMapping.json' }],
        },
        { id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/metadata/docs.json', name: 'docs.json' },
        {
          id: 'docs',
          name: 'docs',
          children: [
            'BUSINESS CONDUCT (DOCTORS).pdf',
            'BUSSINESS CONDUCT (PATIENT).pdf',
            'Deboarding Doctors.pdf',
            'Doctor onboarding.pdf',
            'GDPR.pdf',
            'GRIEVANCE REDRESSAL POLICY.pdf',
            'Manastik legal compliances.pdf',
            'Patient onboarding.pdf',
            'Privacy Policy.pdf',
            'Terms & Conditions.pdf',
          ],
        },
        { id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/metadata/homepage_send_query.json', name: 'homepage-send-query' },
        { id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/metadata/medicine_reminders_metadata.json', name: 'medicine-reminders-metadata' },
        {
          id: 'medicine-reminders',
          name: 'medicine-reminders',
          children: [{ id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/metadata/medicine-reminders/units.json', name: 'units.json' }],
        },
        { id: 'https://s3.ap-south-1.amazonaws.com/assets.manastik.com/metadata/music_therapy_mood_type.json', name: 'music-therapy-moods.json' },
      ],
    },
  ],
};
