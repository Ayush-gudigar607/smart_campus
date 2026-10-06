import * as service from '../services/stats.service.js';
export const overview = async (req,res) => res.json({ success:true,data:await service.getOverview(req.user,res.locals.query) });
export const byDepartment = async (req,res) => res.json({ success:true,data:await service.getByDepartment(req.user,res.locals.query) });
export const byService = async (req,res) => res.json({ success:true,data:await service.getByService(req.user,res.locals.query) });
export const trend = async (req,res) => res.json({ success:true,data:await service.getTrend(req.user,res.locals.query) });
export const staffPerformance = async (req,res) => res.json({ success:true,data:await service.getStaffPerformance(req.user,res.locals.query) });
export const dashboard = async (req,res) => { const result=await service.getDashboard(req.user,res.locals.query); res.set('X-Cache',result.cache).json({success:true,data:result.data}); };
export const workload=async(req,res)=>{const result=await service.getWorkload(req.user);res.set('X-Cache',result.cache).json({success:true,data:result.data});};
