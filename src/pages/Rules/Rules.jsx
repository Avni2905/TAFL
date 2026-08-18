import { motion } from "framer-motion";

const sections = [
  {
    title: "Attendance & Punctuality",
    rules: [
      "Students must arrive 10 minutes before their batch time.",
      "Consistent absenteeism without prior notice may result in removal from the batch.",
      "A minimum of 75% attendance is required to maintain active student status.",
    ]
  },
  {
    title: "Court Conduct",
    rules: [
      "Proper sports attire and non-marking shoes are mandatory on court.",
      "No food or drinks (except water) allowed on the court.",
      "Respect all players, coaches, and staff at all times.",
      "Mobile phones must be on silent during training sessions.",
    ]
  },
  {
    title: "Equipment",
    rules: [
      "Students are responsible for their own rackets and personal gear.",
      "Academy balls and equipment must be handled with care.",
      "Any damage to academy property must be reported immediately.",
    ]
  },
  {
    title: "Fees & Payments",
    rules: [
      "Monthly fees must be paid by the 5th of every month.",
      "A late fee of ₹200 applies after the 10th of the month.",
      "No refunds once fees are paid for a given month.",
      "Fee revisions will be communicated 30 days in advance.",
    ]
  },
  {
    title: "Tournaments",
    rules: [
      "Tournament registrations are the responsibility of the student/parent.",
      "Coach approval is required before registering for any tournament.",
      "TAFL will provide coaching support for approved tournament participants.",
    ]
  },
];

const Rules = () => (
  <div className="pt-20 bg-[#0B3D2E]">
    <section className="py-20 px-6 text-center max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-orange-400 tracking-widest text-xs uppercase mb-2">Guidelines</p>
        <h1 className="text-5xl font-black text-white mb-4">Rules & <span className="text-orange-400">Regulations</span></h1>
        <p className="text-white/60">Standards that every TAFL member is expected to uphold</p>
      </motion.div>
    </section>

    <section className="pb-20 px-6 max-w-3xl mx-auto space-y-6">
      {sections.map((section, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-orange-400 font-bold text-lg mb-4">{i + 1}. {section.title}</h3>
          <ul className="space-y-2">
            {section.rules.map((rule, j) => (
              <li key={j} className="flex items-start gap-3 text-white/60 text-sm">
                <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
                {rule}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </section>
  </div>
);

export default Rules;