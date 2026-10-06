import { runEscalation } from '../jobs/escalation.job.js'; export const runEscalationNow=async(_req,res)=>res.json({success:true,data:await runEscalation()});
