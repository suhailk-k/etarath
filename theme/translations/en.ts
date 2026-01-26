const en = {
  save: 'Save',
  intro: {
    title: 'Are you ready for',
    success: 'Success',
    button: 'Get Started',
  },
  auth: {
    login_title: 'Enter your number',
    login_subtitle: 'We will send you an OTP on this number',
    login_button_otp: 'Via SMS',
    login_button_whatsapp: 'Whatsapp',
    login_placeholder: 'Enter phone number',
    submit: 'Submit',
    verify_title: 'Enter OTP',
    verify_subtitle: 'We send a verification code to\n+{{callingCode}} {{phoneNumber}}',
    resend_button: 'Re-send OTP {{time}}',
    resend_button_whatsapp: 'Resend OTP to Whatsapp',
    resend_button_sms: 'Resend OTP to SMS',
    gender_male: 'Male',
    gender_female: 'Female',
    gender_other: 'Other',
    name_title: "What's your name",
    name_subtitle: 'Let us know how to\nproperly address you',
    name_placeholder: 'Enter here',
    birthday_title: 'When is your\nBirthday',
    avatar_title: 'Select your avatar',
    save: 'Save',
    next: 'Next',
    goal_title: 'Set your Goal',
    notification_permission_title: 'Enable permissions',
    notification_permission_body: 'Elant work better with these',
    notification_permission_button_title: 'Notification',
    notification_permission_footer: 'Get updates to meet your goals',
    done: 'Done',
  },
  home: {
    goal_progress: 'GOAL PROGRESS',
    change: 'Change',
    start_learning: 'Start Learning...',
    explore: 'EXPLORE',
    trending_tutors: 'TRENDING TUTORS',
    trending_discussion: 'TRENDING DISCUSSIONS',
    papers: 'PAPERS',
    global_rank_title: `Don't miss out the ${'\n'}Daily global ranking`,
    global_rank_button: 'View details',
    insight_title: `Personalized Progress ${'\n'}for Smarter Learning`,
    insight_button: 'Go to insights',
  },
  profile: {
    menu: {
      my_account_title: 'My Account',
      my_account_description: 'Manage your personal details',
      achievements_title: 'Achievements',
      achievements_description: 'Complete goal & gain sugar points',
      history_title: 'History',
      history_description: 'View all your\nPurchase',
      goal_title: 'Goal',
      refer_friend_title: 'Refer a friend',
      refer_friend_description: 'Explore your rewards\nand benefits',
      settings_title: 'Settings',
      settings_description: 'Manage your app\nPolicies',
    },
  },
  chat: {
    newChat: '+ New Chat',
    emptyStateTitle: 'No User Found',
    emptyStateDescription: 'Try to find new friends',
    typing: 'Typing...',
    requests: 'Requests ({{count}})',
    accept: 'Accept',
    decline: 'Decline',
    message: 'Message',
    connect: 'Connect',
    pending: 'Pending',
    mentor: '{{course}} Mentor',
    messagePlaceholder: 'Type your message here...',
    aiMentorPlaceholder: 'Message Elant AI',
  },
  studybuddy: {
    search: {
      placeholder: 'Search Users',
      emptyStateTitle: 'Try to find new friends',
      emptyStateDescription: 'Search for study buddies',
      noResultsTitle: 'No User Found',
      noResultsDescription: 'Please try another name',
    },
    invitation: {
      emptyStateTitle: 'No Invitations',
      emptyStateDescription: 'You have no pending invitations',
    },
  },
  forum: {
    answers: 'Answers',
  },
  learn: {
    emptyPaperDescription:
      'Unlock the personalized learning map. Dive in and explore your path to success. Happy Learning!',
    selectPaper: 'Select a paper and start learning!',
    emptyPaper: 'This paper is coming soon',
    noPaperFound: 'No papers found',
    attendChapterExam: 'Attend Chapter Exam',
    select_paper: 'Select Paper',
    tutors: 'Tutors',
    find_tutors: '+ Find tutors',
    no_materials: 'No materials found',
  },
  notifications: {
    no_notifications: 'No notifications found',
  },
  refer_a_friend: {
    title: 'Refer & Earn',
    coin_count: '100',
    gift_count: 'SUGAR CUBES',
    instructions: 'Follow these steps to refer your friends and earn rewards:',
  },
};
export default en;

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? `${Key}${DotPrefix<NestedKeyOf<ObjectType[Key]>>}`
    : Key;
}[keyof ObjectType & string];

export type TxKeyPath = NestedKeyOf<typeof en>;
