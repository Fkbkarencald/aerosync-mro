import { renderToString } from "react-dom/server";
import { Link, MemoryRouter, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Archive, ArrowLeftRight, ArrowRight, BarChart3, Bell, Boxes, Building2, CalendarClock, CalendarDays, CalendarRange, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleAlert, CircleCheck, CircleUserRound, ClipboardCheck, ClipboardList, Clock, Compass, Download, FileCheck2, FileText, Gauge, IdCard, Image, ImageUp, Inbox, Info, LayoutDashboard, LayoutGrid, ListChecks, LogOut, MailCheck, MapPin, Menu, Minus, OctagonAlert, Package, PackageSearch, PanelLeftClose, PanelLeftOpen, Paperclip, Pencil, Phone, Plane, PlaneTakeoff, Plus, Printer, RefreshCw, Route as Route$1, Rows3, Save, ScrollText, Search, Send, Settings, ShieldAlert, ShieldCheck, Timer, TriangleAlert, UserPlus, Users, Wrench, X } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/app/paths.ts
/**
* Central route registry. Every internal link in the app is built
* from these helpers so cross-links can never drift from the route
* definitions in AppRoutes.tsx.
*/
var paths = {
	dashboard: "/",
	login: "/login",
	forgotPassword: "/forgot-password",
	invite: (token) => `/invite/${token}`,
	fleetAvailability: "/fleet/availability",
	fleetPlans: "/fleet/plans",
	fleetPlanNew: "/fleet/plans/new",
	fleetPlan: (id) => `/fleet/plans/${id}`,
	fleetPlanEdit: (id) => `/fleet/plans/${id}/edit`,
	plannedMaintenance: "/fleet/planned-maintenance",
	aircraftList: "/aircraft",
	aircraftNew: "/aircraft/new",
	aircraftDetail: (id) => `/aircraft/${id}`,
	aircraftEdit: (id) => `/aircraft/${id}/edit`,
	aircraftRecords: (id) => `/aircraft/${id}/records`,
	flights: "/flights",
	flightNew: "/flights/new",
	flight: (id) => `/flights/${id}`,
	defects: "/defects",
	defectNew: "/defects/new",
	defectReview: "/defects/review",
	defect: (id) => `/defects/${id}`,
	workOrders: "/work-orders",
	workOrderNew: "/work-orders/new",
	myWorkOrders: "/work-orders/mine",
	workOrder: (id) => `/work-orders/${id}`,
	workOrderSignOff: (id) => `/work-orders/${id}/sign-off`,
	signOffs: "/sign-offs",
	maintenanceRecords: "/records",
	inventoryParts: "/inventory/parts",
	inventoryStock: "/inventory/stock",
	inventoryTransactions: "/inventory/transactions",
	inventoryRequests: "/inventory/requests",
	accounts: "/accounts",
	account: (id) => `/accounts/${id}`,
	accountCostCentres: (id) => `/accounts/${id}/cost-centres`,
	reports: "/reports",
	adminUsers: "/admin/users",
	adminUser: (id) => `/admin/users/${id}`,
	adminProfiles: "/admin/security-profiles",
	adminProfile: (id) => `/admin/security-profiles/${id}`,
	adminAuditLogs: "/admin/audit-logs",
	adminSettings: "/admin/settings"
};
//#endregion
//#region src/data/aircraft.ts
/**
* AeroSync Regional Operations fleet — 10 tails across four types,
* covering every documented availability state.
*/
var aircraft = [
	{
		id: "VH-OYU",
		registration: "VH-OYU",
		manufacturer: "ATR",
		model: "ATR 72-600",
		typeCode: "AT76",
		serialNumber: "MSN 1042",
		yearOfManufacture: 2019,
		base: "MEL",
		location: "MEL · Bay 12",
		operator: "AeroSync Regional Operations",
		accountId: "ACC-001",
		status: "Serviceable",
		availability: "Assigned",
		availabilityReason: "Assigned to ASR-214 (MEL–MQL) under FP-2026-0715",
		maintenanceRisk: "Clear",
		totalHours: 11482.6,
		totalCycles: 13094,
		seats: 70,
		engines: "2 × PW127M",
		configurationNotes: "70Y single class · EFB provisioned · Cargo net mod STC-2210",
		nextFlightId: "ASR-214",
		nextMaintenance: {
			label: "Weekly Check",
			date: "2026-07-15T21:30",
			eventId: "ME-2026-044"
		},
		assignedPlanId: "FP-2026-0715",
		restrictions: []
	},
	{
		id: "VH-KLD",
		registration: "VH-KLD",
		manufacturer: "ATR",
		model: "ATR 72-600",
		typeCode: "AT76",
		serialNumber: "MSN 987",
		yearOfManufacture: 2018,
		base: "MEL",
		location: "MEL · Bay 9",
		operator: "AeroSync Regional Operations",
		accountId: "ACC-001",
		status: "Serviceable",
		availability: "Available",
		availabilityReason: "Released and ready for assignment",
		maintenanceRisk: "Clear",
		totalHours: 13208.1,
		totalCycles: 15310,
		seats: 70,
		engines: "2 × PW127M",
		configurationNotes: "70Y single class · EFB provisioned",
		nextFlightId: "ASR-243",
		nextMaintenance: {
			label: "Weekly Check",
			date: "2026-07-17T20:00",
			eventId: "ME-2026-045"
		},
		assignedPlanId: "FP-2026-0715",
		restrictions: []
	},
	{
		id: "VH-RXT",
		registration: "VH-RXT",
		manufacturer: "ATR",
		model: "ATR 72-600",
		typeCode: "AT76",
		serialNumber: "MSN 1156",
		yearOfManufacture: 2021,
		base: "MEL",
		location: "MQL · Apron 2",
		operator: "AeroSync Regional Operations",
		accountId: "ACC-001",
		status: "AOG",
		availability: "AOG",
		availabilityReason: "DEF-2026-0044 — No.2 hydraulic pump low pressure; WO-2026-0033 awaiting parts at MQL",
		maintenanceRisk: "No Go",
		totalHours: 8654.3,
		totalCycles: 9782,
		seats: 70,
		engines: "2 × PW127M",
		configurationNotes: "70Y single class · EFB provisioned",
		nextMaintenance: {
			label: "Hydraulic pump replacement",
			date: "2026-07-16T08:00",
			eventId: "ME-2026-046"
		},
		assignedPlanId: "FP-2026-0715",
		restrictions: ["Do not dispatch — hydraulic system unserviceable", "Ground runs prohibited until pump replacement"]
	},
	{
		id: "VH-MSA",
		registration: "VH-MSA",
		manufacturer: "De Havilland Canada",
		model: "DHC-8-315",
		typeCode: "DH8C",
		serialNumber: "MSN 598",
		yearOfManufacture: 2004,
		base: "MEL",
		location: "MEL · Hangar 2",
		operator: "AeroSync Regional Operations",
		accountId: "ACC-001",
		status: "Under Maintenance",
		availability: "Under Maintenance",
		availabilityReason: "A-Check in progress (WO-2026-0029), planned completion 18 Jul",
		maintenanceRisk: "No Go",
		totalHours: 31240.8,
		totalCycles: 41277,
		seats: 50,
		engines: "2 × PW123E",
		configurationNotes: "50Y single class · Freight door mod",
		nextMaintenance: {
			label: "A-Check completion",
			date: "2026-07-18T17:00",
			eventId: "ME-2026-041"
		},
		restrictions: ["Aircraft in hangar — panels open, hydraulics isolated"]
	},
	{
		id: "VH-QPB",
		registration: "VH-QPB",
		manufacturer: "De Havilland Canada",
		model: "DHC-8-315",
		typeCode: "DH8C",
		serialNumber: "MSN 612",
		yearOfManufacture: 2005,
		base: "MEL",
		location: "MEL · Bay 7",
		operator: "AeroSync Regional Operations",
		accountId: "ACC-001",
		status: "Serviceable",
		availability: "Available",
		availabilityReason: "Released and ready for assignment",
		maintenanceRisk: "Clear",
		totalHours: 29876.2,
		totalCycles: 39514,
		seats: 50,
		engines: "2 × PW123E",
		configurationNotes: "50Y single class",
		nextFlightId: "ASR-236",
		nextMaintenance: {
			label: "ELT battery replacement",
			date: "2026-07-28T09:00",
			eventId: "ME-2026-048"
		},
		assignedPlanId: "FP-2026-0715",
		restrictions: []
	},
	{
		id: "VH-TRW",
		registration: "VH-TRW",
		manufacturer: "De Havilland Canada",
		model: "DHC-8-315",
		typeCode: "DH8C",
		serialNumber: "MSN 574",
		yearOfManufacture: 2003,
		base: "MEL",
		location: "MEL · Bay 4",
		operator: "AeroSync Regional Operations",
		accountId: "ACC-001",
		status: "Under Maintenance",
		availability: "Awaiting Sign-off",
		availabilityReason: "WO-2026-0035 landing light replacement complete — release pending",
		maintenanceRisk: "At Risk",
		totalHours: 32105.5,
		totalCycles: 42890,
		seats: 50,
		engines: "2 × PW123E",
		configurationNotes: "50Y single class",
		nextFlightId: "ASR-241",
		nextMaintenance: {
			label: "Weekly Check",
			date: "2026-07-19T20:00",
			eventId: "ME-2026-049"
		},
		assignedPlanId: "FP-2026-0715",
		restrictions: ["Not released — certification of WO-2026-0035 outstanding"]
	},
	{
		id: "VH-ZNE",
		registration: "VH-ZNE",
		manufacturer: "Saab",
		model: "Saab 340B",
		typeCode: "SF34",
		serialNumber: "MSN 340B-289",
		yearOfManufacture: 1994,
		base: "MEL",
		location: "MEL · Bay 3",
		operator: "AeroSync Regional Operations",
		accountId: "ACC-001",
		status: "Restricted",
		availability: "Restricted",
		availabilityReason: "DEF-2026-0039 deferred to 22 Jul — cabin trim panel row 4 secured with speed tape",
		maintenanceRisk: "Monitor",
		totalHours: 41230.7,
		totalCycles: 51466,
		seats: 34,
		engines: "2 × GE CT7-9B",
		configurationNotes: "34Y single class",
		nextFlightId: "ASR-231",
		nextMaintenance: {
			label: "Trim panel refit",
			date: "2026-07-21T18:00",
			eventId: "ME-2026-047"
		},
		assignedPlanId: "FP-2026-0715",
		restrictions: ["Deferred defect DEF-2026-0039 — reinspect trim panel daily"]
	},
	{
		id: "VH-JDF",
		registration: "VH-JDF",
		manufacturer: "Saab",
		model: "Saab 340B",
		typeCode: "SF34",
		serialNumber: "MSN 340B-301",
		yearOfManufacture: 1995,
		base: "MEL",
		location: "ABX · Apron 1",
		operator: "AeroSync Regional Operations",
		accountId: "ACC-001",
		status: "Serviceable",
		availability: "Available",
		availabilityReason: "Overnighting ABX — released for morning schedule",
		maintenanceRisk: "Monitor",
		totalHours: 40118.4,
		totalCycles: 50122,
		seats: 34,
		engines: "2 × GE CT7-9B",
		configurationNotes: "34Y single class",
		nextFlightId: "ASR-222",
		nextMaintenance: {
			label: "ELT battery replacement",
			date: "2026-07-28T09:00",
			eventId: "ME-2026-048"
		},
		assignedPlanId: "FP-2026-0715",
		restrictions: []
	},
	{
		id: "VH-BHV",
		registration: "VH-BHV",
		manufacturer: "Beechcraft",
		model: "King Air 350",
		typeCode: "BE30",
		serialNumber: "FL-702",
		yearOfManufacture: 2015,
		base: "MEL",
		location: "MEL · GA Apron",
		operator: "Westline Charter (managed)",
		accountId: "ACC-002",
		status: "Serviceable",
		availability: "Available",
		availabilityReason: "Charter standby — released",
		maintenanceRisk: "Monitor",
		totalHours: 6120.9,
		totalCycles: 5488,
		seats: 9,
		engines: "2 × PT6A-60A",
		configurationNotes: "9-seat executive · Managed for Westline Charter",
		nextFlightId: "ASR-291",
		nextMaintenance: {
			label: "100-hr Inspection",
			date: "2026-07-21T08:00",
			eventId: "ME-2026-050"
		},
		restrictions: []
	},
	{
		id: "VH-LWK",
		registration: "VH-LWK",
		manufacturer: "Beechcraft",
		model: "King Air 350",
		typeCode: "BE30",
		serialNumber: "FL-688",
		yearOfManufacture: 2014,
		base: "MEL",
		location: "MEL · GA Apron",
		operator: "Westline Charter (managed)",
		accountId: "ACC-002",
		status: "Unserviceable",
		availability: "Awaiting Parts",
		availabilityReason: "WO-2026-0027 weather radar R/T unit on backorder (PR-2026-0058)",
		maintenanceRisk: "No Go",
		totalHours: 6890.2,
		totalCycles: 6104,
		seats: 9,
		engines: "2 × PT6A-60A",
		configurationNotes: "9-seat executive · Managed for Westline Charter",
		nextMaintenance: {
			label: "Phase inspection",
			date: "2026-08-04T08:00",
			eventId: "ME-2026-051"
		},
		restrictions: ["Weather radar unserviceable — IFR dispatch limitations apply"]
	}
];
//#endregion
//#region src/data/flights.ts
/**
* Three days of the regional network around the pinned preview moment
* (Wed 15 Jul 2026, 13:00 local). MEL hub with regional ports:
* MQL Mildura · ABX Albury · WGA Wagga Wagga · DBO Dubbo ·
* BHQ Broken Hill · MGB Mount Gambier · GFF Griffith.
*/
var flights = [
	{
		id: "ASR-208",
		origin: "MQL",
		destination: "MEL",
		date: "2026-07-14",
		schedDep: "2026-07-14T16:40",
		schedArr: "2026-07-14T17:55",
		aircraftId: "VH-OYU",
		status: "Completed",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "S. Whitford",
		planId: "FP-2026-0715",
		controllerNotes: "Post-flight walkaround raised DEF-2026-0042 (taxi light). Rectified overnight under WO-2026-0031."
	},
	{
		id: "ASR-201",
		origin: "MEL",
		destination: "ABX",
		date: "2026-07-14",
		schedDep: "2026-07-14T07:10",
		schedArr: "2026-07-14T08:15",
		aircraftId: "VH-JDF",
		status: "Completed",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "M. Calloway",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-204",
		origin: "ABX",
		destination: "MEL",
		date: "2026-07-14",
		schedDep: "2026-07-14T08:45",
		schedArr: "2026-07-14T09:50",
		aircraftId: "VH-JDF",
		status: "Completed",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "M. Calloway",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-206",
		origin: "MEL",
		destination: "MQL",
		date: "2026-07-14",
		schedDep: "2026-07-14T14:20",
		schedArr: "2026-07-14T15:35",
		aircraftId: "VH-OYU",
		status: "Completed",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "S. Whitford",
		turnaroundMins: 65,
		nextFlightId: "ASR-208",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-210",
		origin: "MEL",
		destination: "WGA",
		date: "2026-07-15",
		schedDep: "2026-07-15T06:55",
		schedArr: "2026-07-15T08:05",
		aircraftId: "VH-KLD",
		status: "Completed",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "L. Brandt",
		turnaroundMins: 40,
		nextFlightId: "ASR-211",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-211",
		origin: "WGA",
		destination: "MEL",
		date: "2026-07-15",
		schedDep: "2026-07-15T08:45",
		schedArr: "2026-07-15T09:55",
		aircraftId: "VH-KLD",
		status: "Completed",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "L. Brandt",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-212",
		origin: "MEL",
		destination: "DBO",
		date: "2026-07-15",
		schedDep: "2026-07-15T09:30",
		schedArr: "2026-07-15T11:10",
		aircraftId: "VH-QPB",
		status: "Departed",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "H. Osei",
		turnaroundMins: 45,
		nextFlightId: "ASR-213",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-213",
		origin: "DBO",
		destination: "MEL",
		date: "2026-07-15",
		schedDep: "2026-07-15T11:55",
		schedArr: "2026-07-15T13:35",
		aircraftId: "VH-QPB",
		status: "Departed",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "H. Osei",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-214",
		origin: "MEL",
		destination: "MQL",
		date: "2026-07-15",
		schedDep: "2026-07-15T14:05",
		schedArr: "2026-07-15T15:20",
		aircraftId: "VH-OYU",
		status: "Boarding",
		risk: "Clear",
		riskNote: "DEF-2026-0042 rectified and released 14 Jul (SO-2026-0018). No open items.",
		captainUserId: "USR-009",
		firstOfficer: "S. Whitford",
		turnaroundMins: 30,
		nextFlightId: "ASR-215",
		maintenanceWindow: {
			start: "2026-07-15T15:20",
			end: "2026-07-15T15:50"
		},
		planId: "FP-2026-0715",
		controllerNotes: "Tight 30-minute turnaround at MQL — line crew advised. Aircraft carries serviceable spare taxi light lamp.",
		events: [
			{
				at: "2026-07-15T12:10",
				title: "Aircraft released to line",
				detail: "VH-OYU accepted after overnight weekly-check prep",
				tone: "green",
				byUserId: "USR-005"
			},
			{
				at: "2026-07-15T12:40",
				title: "Fuel order confirmed",
				detail: "2,450 kg uplift, MEL Bay 12",
				tone: "blue"
			},
			{
				at: "2026-07-15T12:55",
				title: "Boarding commenced",
				detail: "Gate 32, 61 pax",
				tone: "blue"
			}
		]
	},
	{
		id: "ASR-215",
		origin: "MQL",
		destination: "MEL",
		date: "2026-07-15",
		schedDep: "2026-07-15T15:50",
		schedArr: "2026-07-15T17:05",
		aircraftId: "VH-OYU",
		status: "Scheduled",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "S. Whitford",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-222",
		origin: "ABX",
		destination: "MEL",
		date: "2026-07-15",
		schedDep: "2026-07-15T14:30",
		schedArr: "2026-07-15T15:35",
		aircraftId: "VH-JDF",
		status: "Scheduled",
		risk: "Monitor",
		riskNote: "DEF-2026-0045 static wick — reported this morning, under assessment. Dispatch permitted per policy.",
		captainUserId: "USR-009",
		firstOfficer: "M. Calloway",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-226",
		origin: "MQL",
		destination: "MEL",
		date: "2026-07-15",
		schedDep: "2026-07-15T16:10",
		schedArr: "2026-07-15T17:25",
		aircraftId: "VH-RXT",
		status: "Cancelled",
		risk: "No Go",
		riskNote: "VH-RXT AOG at MQL (DEF-2026-0044). Passengers re-accommodated on ASR-215.",
		captainUserId: "USR-009",
		firstOfficer: "S. Whitford",
		planId: "FP-2026-0715",
		controllerNotes: "Recovery pump inbound via road freight (ITX-2026-0212). Earliest release estimate 16 Jul 14:00."
	},
	{
		id: "ASR-231",
		origin: "MEL",
		destination: "ABX",
		date: "2026-07-15",
		schedDep: "2026-07-15T17:30",
		schedArr: "2026-07-15T18:35",
		aircraftId: "VH-ZNE",
		status: "Scheduled",
		risk: "Monitor",
		riskNote: "Deferred defect DEF-2026-0039 (cabin trim) — daily reinspection completed 09:40.",
		captainUserId: "USR-009",
		firstOfficer: "L. Brandt",
		turnaroundMins: 35,
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-236",
		origin: "MEL",
		destination: "MGB",
		date: "2026-07-15",
		schedDep: "2026-07-15T17:50",
		schedArr: "2026-07-15T19:00",
		aircraftId: "VH-QPB",
		status: "Scheduled",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "H. Osei",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-241",
		origin: "MEL",
		destination: "BHQ",
		date: "2026-07-15",
		schedDep: "2026-07-15T18:40",
		schedArr: "2026-07-15T20:15",
		aircraftId: "VH-TRW",
		status: "Scheduled",
		risk: "At Risk",
		riskNote: "VH-TRW awaiting sign-off on WO-2026-0035. Release required by 17:30 or swap to VH-KLD.",
		captainUserId: "USR-009",
		firstOfficer: "H. Osei",
		planId: "FP-2026-0715",
		controllerNotes: "LAME D. Reyes assigned for certification this afternoon. Fleet planning holding VH-KLD as cover."
	},
	{
		id: "ASR-243",
		origin: "MEL",
		destination: "GFF",
		date: "2026-07-15",
		schedDep: "2026-07-15T19:10",
		schedArr: "2026-07-15T20:25",
		aircraftId: "VH-KLD",
		status: "Scheduled",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "L. Brandt",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-291",
		origin: "MEL",
		destination: "DBO",
		date: "2026-07-15",
		schedDep: "2026-07-15T20:00",
		schedArr: "2026-07-15T21:45",
		aircraftId: "VH-BHV",
		status: "Scheduled",
		risk: "Monitor",
		riskNote: "Charter (Westline) — nav database card update due before departure, DEF-2026-0048 under review.",
		firstOfficer: "Westline crew",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-252",
		origin: "MEL",
		destination: "WGA",
		date: "2026-07-16",
		schedDep: "2026-07-16T06:55",
		schedArr: "2026-07-16T08:05",
		aircraftId: "VH-KLD",
		status: "Scheduled",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "L. Brandt",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-254",
		origin: "MEL",
		destination: "MQL",
		date: "2026-07-16",
		schedDep: "2026-07-16T07:20",
		schedArr: "2026-07-16T08:35",
		aircraftId: "VH-OYU",
		status: "Scheduled",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "S. Whitford",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-258",
		origin: "MEL",
		destination: "ABX",
		date: "2026-07-16",
		schedDep: "2026-07-16T09:40",
		schedArr: "2026-07-16T10:45",
		status: "Scheduled",
		risk: "At Risk",
		riskNote: "No aircraft assigned — VH-RXT recovery pending. Planner action required.",
		planId: "FP-2026-0715"
	},
	{
		id: "ASR-262",
		origin: "MEL",
		destination: "DBO",
		date: "2026-07-16",
		schedDep: "2026-07-16T10:15",
		schedArr: "2026-07-16T11:55",
		aircraftId: "VH-QPB",
		status: "Scheduled",
		risk: "Clear",
		captainUserId: "USR-009",
		firstOfficer: "H. Osei",
		planId: "FP-2026-0715"
	}
];
//#endregion
//#region src/data/defects.ts
var defects = [
	{
		id: "DEF-2026-0048",
		aircraftId: "VH-BHV",
		flightId: "ASR-291",
		title: "Navigation database card expired",
		description: "During pre-charter checks the GTN 750 navigation database was found expired (cycle 2607 ended 9 Jul). Current cycle card not on board. Charter departure ASR-291 scheduled 20:00 tonight.",
		locationOnAircraft: "Flight deck — avionics stack",
		ataChapter: "34 — Navigation",
		severity: "Significant",
		category: "Technical",
		source: "Line Inspection",
		status: "Reported",
		reportedByUserId: "USR-005",
		reportedAt: "2026-07-15T11:32",
		reportedLocation: "MEL · GA Apron",
		attachments: [{
			name: "gtn750-db-screen.jpg",
			kind: "photo",
			size: "2.1 MB",
			uploadedByUserId: "USR-005",
			uploadedAt: "2026-07-15T11:33"
		}],
		timeline: [{
			at: "2026-07-15T11:32",
			title: "Defect reported",
			detail: "Submitted from line inspection at MEL GA Apron",
			byUserId: "USR-005",
			tone: "blue"
		}],
		availabilityImpact: "VH-BHV remains Available — database update required before IFR dispatch",
		flightImpact: "ASR-291 (dep 20:00) at risk if update not completed"
	},
	{
		id: "DEF-2026-0047",
		aircraftId: "VH-OYU",
		flightId: "ASR-206",
		title: "FO windscreen wiper smearing",
		description: "First officer reports wiper smearing across centre of sweep in moderate rain on approach into MQL. Visibility acceptable but degraded. Suspect blade wear.",
		locationOnAircraft: "Flight deck — RH windscreen",
		ataChapter: "30 — Ice & Rain Protection",
		severity: "Minor",
		category: "Technical",
		source: "Pilot Report",
		status: "Under Review",
		reportedByUserId: "USR-009",
		reportedAt: "2026-07-14T15:48",
		reportedLocation: "MQL · Apron 2",
		reviewedByUserId: "USR-003",
		reviewNotes: "Review in progress — checking blade stock (WB-3302-114) before deciding rectify now vs next weekly check.",
		attachments: [],
		timeline: [{
			at: "2026-07-14T15:48",
			title: "Defect reported",
			detail: "Pilot report after ASR-206 arrival MQL",
			byUserId: "USR-009",
			tone: "blue"
		}, {
			at: "2026-07-15T08:20",
			title: "Review started",
			detail: "Assessing rectification window against wiper blade stock",
			byUserId: "USR-003",
			tone: "blue"
		}],
		availabilityImpact: "None — VH-OYU remains Assigned",
		flightImpact: "Nil — VMC forecast for today’s sectors"
	},
	{
		id: "DEF-2026-0046",
		aircraftId: "VH-KLD",
		title: "Cabin reading light flickering row 7",
		description: "Passenger reading light 7C flickers intermittently and does not respond reliably to switch input. No burning smell, breaker checked normal.",
		locationOnAircraft: "Cabin — PSU row 7",
		ataChapter: "33 — Lights",
		severity: "Minor",
		category: "Cabin",
		source: "Cabin Crew",
		status: "Reported",
		reportedByUserId: "USR-009",
		reportedAt: "2026-07-15T10:05",
		reportedLocation: "MEL · Bay 9",
		attachments: [],
		timeline: [{
			at: "2026-07-15T10:05",
			title: "Defect reported",
			detail: "Logged on behalf of cabin crew after ASR-211",
			byUserId: "USR-009",
			tone: "blue"
		}],
		availabilityImpact: "None — VH-KLD remains Available"
	},
	{
		id: "DEF-2026-0045",
		aircraftId: "VH-JDF",
		flightId: "ASR-222",
		title: "Static wick missing — RH elevator",
		description: "Walkaround at ABX found outboard static discharge wick missing from RH elevator trailing edge. Remaining wicks secure. No radio interference reported on inbound sector.",
		locationOnAircraft: "Empennage — RH elevator T/E",
		ataChapter: "23 — Communications",
		severity: "Minor",
		category: "Technical",
		source: "Pilot Report",
		status: "Reported",
		reportedByUserId: "USR-009",
		reportedAt: "2026-07-15T08:10",
		reportedLocation: "ABX · Apron 1",
		attachments: [{
			name: "rh-elevator-wick.jpg",
			kind: "photo",
			size: "1.8 MB",
			uploadedByUserId: "USR-009",
			uploadedAt: "2026-07-15T08:11"
		}],
		timeline: [{
			at: "2026-07-15T08:10",
			title: "Defect reported",
			detail: "Pilot walkaround before ASR-222 at ABX",
			byUserId: "USR-009",
			tone: "blue"
		}],
		availabilityImpact: "None — dispatch permitted per operator policy (min wick count met)",
		flightImpact: "ASR-222 dispatched — Monitor"
	},
	{
		id: "DEF-2026-0044",
		aircraftId: "VH-RXT",
		flightId: "ASR-226",
		title: "No.2 engine-driven hydraulic pump low pressure",
		description: "On start-up for ASR-226, No.2 hydraulic system pressure fluctuated then dropped below 1,500 psi with EDP caution. Shutdown completed per QRH. Fluid level normal, no visible leak. Suspect engine-driven pump internal failure.",
		locationOnAircraft: "No.2 engine — EDP / hydraulic bay",
		ataChapter: "29 — Hydraulic Power",
		severity: "Critical",
		category: "Technical",
		source: "Pilot Report",
		status: "Work Order Created",
		reportedByUserId: "USR-009",
		reportedAt: "2026-07-15T07:41",
		reportedLocation: "MQL · Apron 2",
		reviewedByUserId: "USR-003",
		reviewNotes: "Critical — aircraft grounded at MQL. WO-2026-0033 raised for EDP replacement. Serviceable pump HP-2977-201 transferred from MEL main store via road freight.",
		workOrderId: "WO-2026-0033",
		attachments: [{
			name: "edp-caution-ecam.jpg",
			kind: "photo",
			size: "2.4 MB",
			uploadedByUserId: "USR-009",
			uploadedAt: "2026-07-15T07:44"
		}, {
			name: "qrh-actions-note.pdf",
			kind: "document",
			size: "180 KB",
			uploadedByUserId: "USR-003",
			uploadedAt: "2026-07-15T08:02"
		}],
		timeline: [
			{
				at: "2026-07-15T07:41",
				title: "Defect reported",
				detail: "Start-up abort on stand, ASR-226",
				byUserId: "USR-009",
				tone: "blue"
			},
			{
				at: "2026-07-15T07:52",
				title: "Review started",
				detail: "Duty controller triage — severity confirmed Critical",
				byUserId: "USR-003",
				tone: "blue"
			},
			{
				at: "2026-07-15T07:55",
				title: "Aircraft grounded — AOG",
				detail: "Availability set to AOG; ASR-226 cancelled",
				byUserId: "USR-003",
				tone: "red"
			},
			{
				at: "2026-07-15T08:15",
				title: "Work order created",
				detail: "WO-2026-0033 — replace No.2 EDP",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "WO-2026-0033",
					to: "/work-orders/WO-2026-0033"
				}
			}
		],
		availabilityImpact: "VH-RXT AOG at MQL — removed from FP-2026-0715 assignments",
		flightImpact: "ASR-226 cancelled; ASR-258 (16 Jul) unassigned pending recovery"
	},
	{
		id: "DEF-2026-0043",
		aircraftId: "VH-TRW",
		title: "LH landing light inoperative",
		description: "LH landing light found inoperative during nightly line check. Lamp filament failure confirmed; fitting and wiring serviceable.",
		locationOnAircraft: "LH wing — landing light",
		ataChapter: "33 — Lights",
		severity: "Significant",
		category: "Technical",
		source: "Line Inspection",
		status: "Rectified",
		reportedByUserId: "USR-005",
		reportedAt: "2026-07-14T21:15",
		reportedLocation: "MEL · Bay 4",
		reviewedByUserId: "USR-003",
		reviewNotes: "Night ops requirement — rectify before ASR-241 (15 Jul evening).",
		workOrderId: "WO-2026-0035",
		attachments: [{
			name: "landing-light-lamp.jpg",
			kind: "photo",
			size: "1.5 MB",
			uploadedByUserId: "USR-005",
			uploadedAt: "2026-07-14T21:17"
		}],
		timeline: [
			{
				at: "2026-07-14T21:15",
				title: "Defect reported",
				detail: "Nightly line check, MEL Bay 4",
				byUserId: "USR-005",
				tone: "blue"
			},
			{
				at: "2026-07-14T21:40",
				title: "Review completed",
				detail: "Rectification required before night sector",
				byUserId: "USR-003",
				tone: "blue"
			},
			{
				at: "2026-07-14T21:45",
				title: "Work order created",
				detail: "WO-2026-0035 — replace LH landing light lamp",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "WO-2026-0035",
					to: "/work-orders/WO-2026-0035"
				}
			},
			{
				at: "2026-07-15T10:26",
				title: "Rectified",
				detail: "Lamp replaced and ops-tested — awaiting certification",
				byUserId: "USR-005",
				tone: "green"
			}
		],
		availabilityImpact: "VH-TRW Awaiting Sign-off — release needed by 17:30 for ASR-241",
		flightImpact: "ASR-241 At Risk until certified"
	},
	{
		id: "DEF-2026-0042",
		aircraftId: "VH-OYU",
		flightId: "ASR-208",
		title: "Nose gear taxi light unserviceable",
		description: "Taxi light inoperative on arrival MEL after ASR-208. Confirmed lamp failure during post-flight inspection; lens and wiring undamaged. Aircraft required for full schedule 15 Jul.",
		locationOnAircraft: "Nose landing gear — taxi light",
		ataChapter: "33 — Lights",
		severity: "Minor",
		category: "Technical",
		source: "Pilot Report",
		status: "Closed",
		reportedByUserId: "USR-009",
		reportedAt: "2026-07-13T18:22",
		reportedLocation: "MEL · Bay 12",
		reviewedByUserId: "USR-003",
		reviewNotes: "Straightforward lamp replacement — schedule overnight, no availability impact to 14 Jul programme.",
		workOrderId: "WO-2026-0031",
		closedAt: "2026-07-14T18:47",
		attachments: [{
			name: "taxi-light-post-flight.jpg",
			kind: "photo",
			size: "1.9 MB",
			uploadedByUserId: "USR-009",
			uploadedAt: "2026-07-13T18:25"
		}],
		timeline: [
			{
				at: "2026-07-13T18:22",
				title: "Defect reported",
				detail: "Pilot post-flight report, ASR-208 arrival",
				byUserId: "USR-009",
				tone: "blue"
			},
			{
				at: "2026-07-13T19:05",
				title: "Review started",
				detail: "Duty controller triage",
				byUserId: "USR-003",
				tone: "blue"
			},
			{
				at: "2026-07-13T19:12",
				title: "Work order created",
				detail: "WO-2026-0031 — replace taxi light lamp",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "WO-2026-0031",
					to: "/work-orders/WO-2026-0031"
				}
			},
			{
				at: "2026-07-14T17:55",
				title: "Rectified",
				detail: "Lamp replaced, ops check satisfactory",
				byUserId: "USR-005",
				tone: "green"
			},
			{
				at: "2026-07-14T18:42",
				title: "Released to service",
				detail: "SO-2026-0018 certified by D. Reyes",
				byUserId: "USR-014",
				tone: "green",
				refLink: {
					label: "SO-2026-0018",
					to: "/sign-offs"
				}
			},
			{
				at: "2026-07-14T18:47",
				title: "Defect closed",
				detail: "Closed automatically on sign-off",
				byUserId: "USR-003",
				tone: "green"
			}
		],
		availabilityImpact: "Resolved — VH-OYU returned to Available 14 Jul 18:47",
		flightImpact: "Nil — rectified before 15 Jul schedule"
	},
	{
		id: "DEF-2026-0041",
		aircraftId: "VH-MSA",
		title: "Hydraulic seep — LH MLG actuator",
		description: "During A-Check panel inspection, slight hydraulic seep observed at LH main landing gear retraction actuator gland. Within limits but trending; recommend seal replacement while aircraft is open.",
		locationOnAircraft: "LH MLG bay — retraction actuator",
		ataChapter: "29 — Hydraulic Power",
		severity: "Significant",
		category: "Technical",
		source: "Scheduled Check",
		status: "Work Order Created",
		reportedByUserId: "USR-007",
		reportedAt: "2026-07-14T10:52",
		reportedLocation: "MEL · Hangar 2",
		reviewedByUserId: "USR-003",
		reviewNotes: "Fold into A-Check package — seal kit in stock. Task added to WO-2026-0029.",
		workOrderId: "WO-2026-0029",
		attachments: [{
			name: "mlg-actuator-seep.jpg",
			kind: "photo",
			size: "2.6 MB",
			uploadedByUserId: "USR-007",
			uploadedAt: "2026-07-14T10:55"
		}],
		timeline: [
			{
				at: "2026-07-14T10:52",
				title: "Defect reported",
				detail: "Found during A-Check inspection",
				byUserId: "USR-007",
				tone: "blue"
			},
			{
				at: "2026-07-14T11:30",
				title: "Review completed",
				detail: "Rectify within A-Check — seal kit SK-2907-011 reserved",
				byUserId: "USR-003",
				tone: "blue"
			},
			{
				at: "2026-07-14T11:32",
				title: "Linked to work order",
				detail: "Task added to WO-2026-0029 (A-Check)",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "WO-2026-0029",
					to: "/work-orders/WO-2026-0029"
				}
			}
		],
		availabilityImpact: "None additional — aircraft already Under Maintenance for A-Check"
	},
	{
		id: "DEF-2026-0040",
		aircraftId: "VH-QPB",
		title: "Seat 11A recline mechanism jammed",
		description: "Seat 11A stuck partially reclined. Recline lock replaced and seat function checked serviceable.",
		locationOnAircraft: "Cabin — seat 11A",
		ataChapter: "25 — Equipment & Furnishings",
		severity: "Minor",
		category: "Cabin",
		source: "Cabin Crew",
		status: "Closed",
		reportedByUserId: "USR-009",
		reportedAt: "2026-07-08T12:40",
		reportedLocation: "MEL · Bay 7",
		reviewedByUserId: "USR-003",
		workOrderId: "WO-2026-0024",
		closedAt: "2026-07-09T16:20",
		attachments: [],
		timeline: [
			{
				at: "2026-07-08T12:40",
				title: "Defect reported",
				byUserId: "USR-009",
				tone: "blue"
			},
			{
				at: "2026-07-08T14:05",
				title: "Work order created",
				detail: "WO-2026-0024",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "WO-2026-0024",
					to: "/work-orders/WO-2026-0024"
				}
			},
			{
				at: "2026-07-09T15:45",
				title: "Rectified",
				detail: "Recline lock replaced",
				byUserId: "USR-005",
				tone: "green"
			},
			{
				at: "2026-07-09T16:20",
				title: "Defect closed",
				detail: "Released under SO-2026-0016",
				byUserId: "USR-008",
				tone: "green"
			}
		],
		availabilityImpact: "Resolved 9 Jul"
	},
	{
		id: "DEF-2026-0039",
		aircraftId: "VH-ZNE",
		title: "Cabin trim panel loose — row 4 sidewall",
		description: "Sidewall trim panel at row 4 has two failed fasteners and rattles in flight. Panel secured with speed tape as interim measure. No interference with placards or emergency equipment.",
		locationOnAircraft: "Cabin — row 4 RH sidewall",
		ataChapter: "25 — Equipment & Furnishings",
		severity: "Minor",
		category: "Cosmetic",
		source: "Cabin Crew",
		status: "Deferred",
		reportedByUserId: "USR-009",
		reportedAt: "2026-07-11T09:20",
		reportedLocation: "MEL · Bay 3",
		reviewedByUserId: "USR-003",
		reviewNotes: "Deferred per operator policy — cosmetic, no structural involvement. Fastener kit on order.",
		deferral: {
			reason: "Cosmetic defect — panel secured, no effect on safe operation. Rectify at next scheduled line visit.",
			until: "2026-07-22",
			reference: "DDG-25-04 (operator policy, simplified)",
			approvedByUserId: "USR-003"
		},
		workOrderId: "WO-2026-0032",
		attachments: [{
			name: "row4-trim-panel.jpg",
			kind: "photo",
			size: "1.2 MB",
			uploadedByUserId: "USR-009",
			uploadedAt: "2026-07-11T09:22"
		}],
		timeline: [
			{
				at: "2026-07-11T09:20",
				title: "Defect reported",
				byUserId: "USR-009",
				tone: "blue"
			},
			{
				at: "2026-07-11T10:05",
				title: "Review started",
				byUserId: "USR-003",
				tone: "blue"
			},
			{
				at: "2026-07-11T10:30",
				title: "Deferred",
				detail: "Until 22 Jul under DDG-25-04 — aircraft Restricted, risk Monitor",
				byUserId: "USR-003",
				tone: "amber"
			},
			{
				at: "2026-07-14T08:00",
				title: "Rectification scheduled",
				detail: "WO-2026-0032 created for 21 Jul line visit",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "WO-2026-0032",
					to: "/work-orders/WO-2026-0032"
				}
			}
		],
		availabilityImpact: "VH-ZNE Restricted — daily reinspection required until rectified",
		flightImpact: "Fleet risk Monitor on assigned sectors"
	},
	{
		id: "DEF-2026-0038",
		aircraftId: "VH-LWK",
		title: "Weather radar intermittent — no returns above FL180",
		description: "Weather radar intermittently loses returns in cruise. Fault isolated to receiver/transmitter unit. R/T unit requires replacement; unit on backorder from supplier.",
		locationOnAircraft: "Nose — radar R/T unit",
		ataChapter: "34 — Navigation",
		severity: "Significant",
		category: "Technical",
		source: "Pilot Report",
		status: "Work Order Created",
		reportedByUserId: "USR-009",
		reportedAt: "2026-07-06T13:15",
		reportedLocation: "MEL · GA Apron",
		reviewedByUserId: "USR-003",
		reviewNotes: "Confirmed R/T unit fault after BITE checks. Replacement WX-3401-770 on backorder — ETA 18 Jul.",
		workOrderId: "WO-2026-0027",
		attachments: [{
			name: "radar-bite-report.pdf",
			kind: "document",
			size: "240 KB",
			uploadedByUserId: "USR-007",
			uploadedAt: "2026-07-07T09:40"
		}],
		timeline: [
			{
				at: "2026-07-06T13:15",
				title: "Defect reported",
				byUserId: "USR-009",
				tone: "blue"
			},
			{
				at: "2026-07-06T15:00",
				title: "Review completed",
				detail: "BITE check scheduled",
				byUserId: "USR-003",
				tone: "blue"
			},
			{
				at: "2026-07-07T10:02",
				title: "Work order created",
				detail: "WO-2026-0027 — replace radar R/T unit",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "WO-2026-0027",
					to: "/work-orders/WO-2026-0027"
				}
			},
			{
				at: "2026-07-07T10:20",
				title: "Awaiting parts",
				detail: "PR-2026-0058 backordered with Skyparts Logistics",
				byUserId: "USR-011",
				tone: "orange"
			}
		],
		availabilityImpact: "VH-LWK Awaiting Parts — IFR dispatch limitations apply",
		flightImpact: "Westline charter programme suspended for this tail"
	},
	{
		id: "DEF-2026-0035",
		aircraftId: "VH-MSA",
		title: "Cargo net attachment ring worn",
		description: "Forward cargo net attachment ring worn beyond limits. Replaced with serviceable ring from stock.",
		locationOnAircraft: "Forward cargo compartment",
		ataChapter: "25 — Equipment & Furnishings",
		severity: "Minor",
		category: "Technical",
		source: "Line Inspection",
		status: "Closed",
		reportedByUserId: "USR-005",
		reportedAt: "2026-06-24T08:10",
		reportedLocation: "MEL · Bay 6",
		reviewedByUserId: "USR-003",
		workOrderId: "WO-2026-0022",
		closedAt: "2026-06-25T14:30",
		attachments: [],
		timeline: [
			{
				at: "2026-06-24T08:10",
				title: "Defect reported",
				byUserId: "USR-005",
				tone: "blue"
			},
			{
				at: "2026-06-24T09:00",
				title: "Work order created",
				detail: "WO-2026-0022",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "WO-2026-0022",
					to: "/work-orders/WO-2026-0022"
				}
			},
			{
				at: "2026-06-25T14:30",
				title: "Defect closed",
				detail: "Released under SO-2026-0015",
				byUserId: "USR-008",
				tone: "green"
			}
		],
		availabilityImpact: "Resolved 25 Jun"
	}
];
//#endregion
//#region src/data/workOrders.ts
var workOrders = [
	{
		id: "WO-2026-0036",
		aircraftId: "VH-OYU",
		title: "Weekly check — VH-OYU",
		description: "Scheduled weekly check per operator maintenance programme: general visual inspection, fluid levels, tyre pressures, lighting and emergency equipment checks.",
		priority: "Routine",
		status: "Assigned",
		assignedToUserId: "USR-014",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-07-14T09:00",
		dueAt: "2026-07-16T06:00",
		scheduledStart: "2026-07-15T21:30",
		scheduledEnd: "2026-07-16T00:30",
		estimatedManhours: 3,
		actualManhours: 0,
		partsState: "Not Required",
		partRequestIds: [],
		inspection: {
			required: false,
			status: "Not Required"
		},
		tasks: [
			{
				seq: 1,
				title: "General visual inspection — fuselage, wings, empennage",
				done: false
			},
			{
				seq: 2,
				title: "Check engine oil levels and record",
				done: false
			},
			{
				seq: 3,
				title: "Check tyre pressures and condition",
				done: false
			},
			{
				seq: 4,
				title: "Operational check — internal and external lighting",
				done: false
			},
			{
				seq: 5,
				title: "Check emergency equipment stowage and dates",
				done: false
			},
			{
				seq: 6,
				title: "Cabin condition inspection and log review",
				done: false
			}
		],
		labour: [],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-07-14T09:00",
			title: "Work order created",
			detail: "Weekly check scheduled from maintenance programme (ME-2026-044)",
			byUserId: "USR-003",
			tone: "blue"
		}, {
			at: "2026-07-14T09:05",
			title: "Assigned",
			detail: "Assigned to D. Reyes — overnight slot 21:30",
			byUserId: "USR-003",
			tone: "amber"
		}],
		costCentreCode: "LINE-MAINT"
	},
	{
		id: "WO-2026-0035",
		aircraftId: "VH-TRW",
		defectId: "DEF-2026-0043",
		title: "Replace LH landing light lamp",
		description: "Replace failed LH landing light sealed-beam lamp per AMM 33-42-11. Operational test on completion. Required before night sector ASR-241 (15 Jul 18:40).",
		priority: "Urgent",
		status: "Ready for Sign-off",
		assignedToUserId: "USR-005",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-07-14T21:45",
		dueAt: "2026-07-15T17:30",
		scheduledStart: "2026-07-15T09:00",
		scheduledEnd: "2026-07-15T11:00",
		estimatedManhours: 1.5,
		actualManhours: 1.2,
		partsState: "Issued",
		partRequestIds: ["PR-2026-0060"],
		inspection: {
			required: true,
			type: "Duplicate inspection — flight control zone not affected; ops check witnessed",
			status: "Passed",
			inspectorUserId: "USR-014",
			note: "Ops check witnessed 10:26 — beam alignment within limits."
		},
		tasks: [
			{
				seq: 1,
				title: "Open LH landing light access panel",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T09:20",
				manhours: .2
			},
			{
				seq: 2,
				title: "Remove failed lamp — record part off (LL-3342-215)",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T09:35",
				manhours: .2
			},
			{
				seq: 3,
				title: "Install serviceable lamp — torque and safety per AMM 33-42-11",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T10:05",
				note: "New lamp S/N LL26-08812",
				manhours: .5
			},
			{
				seq: 4,
				title: "Operational test — landing light ON/OFF, beam alignment",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T10:26",
				manhours: .2
			},
			{
				seq: 5,
				title: "Close access panel and secure",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T10:32",
				manhours: .1
			}
		],
		labour: [{
			userId: "USR-005",
			date: "2026-07-15",
			hours: 1.2,
			note: "Lamp replacement and ops test"
		}],
		notes: [{
			byUserId: "USR-005",
			at: "2026-07-15T10:35",
			text: "Lamp replaced, ops check satisfactory. Old lamp tagged unserviceable and returned to stores. Ready for certification."
		}],
		attachments: [{
			name: "ll-installed.jpg",
			kind: "photo",
			size: "1.6 MB",
			uploadedByUserId: "USR-005",
			uploadedAt: "2026-07-15T10:33"
		}, {
			name: "amm-33-42-11-extract.pdf",
			kind: "document",
			size: "310 KB",
			uploadedByUserId: "USR-005",
			uploadedAt: "2026-07-15T09:05"
		}],
		timeline: [
			{
				at: "2026-07-14T21:45",
				title: "Work order created",
				detail: "From defect DEF-2026-0043",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "DEF-2026-0043",
					to: "/defects/DEF-2026-0043"
				}
			},
			{
				at: "2026-07-14T21:50",
				title: "Assigned",
				detail: "Assigned to J. Munro",
				byUserId: "USR-003",
				tone: "amber"
			},
			{
				at: "2026-07-15T09:00",
				title: "Work started",
				byUserId: "USR-005",
				tone: "blue"
			},
			{
				at: "2026-07-15T09:10",
				title: "Part issued",
				detail: "LL-3342-215 × 1 from MEL Main Store (ITX-2026-0210)",
				byUserId: "USR-011",
				tone: "green"
			},
			{
				at: "2026-07-15T10:26",
				title: "Inspection passed",
				detail: "Ops check witnessed by D. Reyes",
				byUserId: "USR-014",
				tone: "green"
			},
			{
				at: "2026-07-15T10:35",
				title: "Ready for sign-off",
				detail: "Availability set to Awaiting Sign-off",
				byUserId: "USR-005",
				tone: "orange"
			}
		],
		costCentreCode: "LINE-MAINT"
	},
	{
		id: "WO-2026-0033",
		aircraftId: "VH-RXT",
		defectId: "DEF-2026-0044",
		title: "Replace No.2 engine-driven hydraulic pump",
		description: "AOG recovery — replace No.2 EDP per AMM 29-11-41 following low-pressure failure at MQL. Serviceable pump HP-2977-201 transferred from MEL by road freight. Post-installation leak check and ground run required.",
		priority: "AOG",
		status: "Awaiting Parts",
		assignedToUserId: "USR-005",
		teamUserIds: ["USR-012"],
		createdByUserId: "USR-003",
		createdAt: "2026-07-15T08:15",
		dueAt: "2026-07-16T14:00",
		scheduledStart: "2026-07-16T08:00",
		scheduledEnd: "2026-07-16T13:00",
		estimatedManhours: 8,
		actualManhours: 1.5,
		partsState: "Requested",
		partRequestIds: ["PR-2026-0061"],
		inspection: {
			required: true,
			type: "Independent inspection — hydraulic system disturbance",
			status: "Pending",
			note: "Independent inspection required after pump installation and leak check."
		},
		tasks: [
			{
				seq: 1,
				title: "Depressurise and isolate No.2 hydraulic system",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T10:40",
				manhours: .5
			},
			{
				seq: 2,
				title: "Remove failed EDP — record part off, cap lines",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T11:55",
				note: "Failed unit S/N HP24-31177 quarantined for supplier investigation",
				manhours: 1
			},
			{
				seq: 3,
				title: "Install serviceable EDP HP-2977-201",
				done: false
			},
			{
				seq: 4,
				title: "Replenish and bleed No.2 hydraulic system",
				done: false
			},
			{
				seq: 5,
				title: "Ground run — leak and pressure check",
				done: false
			},
			{
				seq: 6,
				title: "Independent inspection of installation",
				done: false
			}
		],
		labour: [{
			userId: "USR-005",
			date: "2026-07-15",
			hours: 1.5,
			note: "System isolation and pump removal at MQL"
		}],
		notes: [{
			byUserId: "USR-005",
			at: "2026-07-15T12:05",
			text: "Removal complete. Replacement pump departed MEL 11:30 by road freight — ETA MQL 17:30 today. Will install first thing tomorrow with G. Liu assisting."
		}, {
			byUserId: "USR-003",
			at: "2026-07-15T12:20",
			text: "Fleet planning advised — ASR-226 cancelled, ASR-258 held unassigned. Target release 16 Jul 14:00."
		}],
		attachments: [{
			name: "edp-removed.jpg",
			kind: "photo",
			size: "2.9 MB",
			uploadedByUserId: "USR-005",
			uploadedAt: "2026-07-15T12:00"
		}, {
			name: "freight-consignment.pdf",
			kind: "document",
			size: "96 KB",
			uploadedByUserId: "USR-011",
			uploadedAt: "2026-07-15T11:35"
		}],
		timeline: [
			{
				at: "2026-07-15T08:15",
				title: "Work order created",
				detail: "AOG priority — from defect DEF-2026-0044",
				byUserId: "USR-003",
				tone: "red",
				refLink: {
					label: "DEF-2026-0044",
					to: "/defects/DEF-2026-0044"
				}
			},
			{
				at: "2026-07-15T08:20",
				title: "Assigned",
				detail: "J. Munro dispatched to MQL, G. Liu supporting",
				byUserId: "USR-003",
				tone: "amber"
			},
			{
				at: "2026-07-15T08:40",
				title: "Part request raised",
				detail: "PR-2026-0061 — EDP HP-2977-201, urgency AOG",
				byUserId: "USR-005",
				tone: "orange"
			},
			{
				at: "2026-07-15T10:15",
				title: "Work started",
				detail: "On site MQL Apron 2",
				byUserId: "USR-005",
				tone: "blue"
			},
			{
				at: "2026-07-15T11:30",
				title: "Awaiting parts",
				detail: "Pump in transit MEL → MQL (ITX-2026-0212)",
				byUserId: "USR-011",
				tone: "orange"
			}
		],
		costCentreCode: "AOG-RECOVERY"
	},
	{
		id: "WO-2026-0032",
		aircraftId: "VH-ZNE",
		defectId: "DEF-2026-0039",
		title: "Refit cabin trim panel — row 4 sidewall",
		description: "Rectify deferred defect DEF-2026-0039: replace failed fasteners and refit row 4 RH sidewall trim panel. Fastener kit TF-2551-040 required.",
		priority: "Routine",
		status: "Open",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-07-14T08:00",
		dueAt: "2026-07-21T20:00",
		scheduledStart: "2026-07-21T18:00",
		scheduledEnd: "2026-07-21T19:30",
		estimatedManhours: 1.5,
		actualManhours: 0,
		partsState: "Requested",
		partRequestIds: ["PR-2026-0062"],
		inspection: {
			required: false,
			status: "Not Required"
		},
		tasks: [
			{
				seq: 1,
				title: "Remove speed tape and inspect panel edge",
				done: false
			},
			{
				seq: 2,
				title: "Replace failed fasteners (kit TF-2551-040)",
				done: false
			},
			{
				seq: 3,
				title: "Refit panel and check security",
				done: false
			},
			{
				seq: 4,
				title: "Clear deferral DEF-2026-0039 and update log",
				done: false
			}
		],
		labour: [],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-07-14T08:00",
			title: "Work order created",
			detail: "Scheduled rectification of deferred defect",
			byUserId: "USR-003",
			tone: "blue",
			refLink: {
				label: "DEF-2026-0039",
				to: "/defects/DEF-2026-0039"
			}
		}, {
			at: "2026-07-14T08:10",
			title: "Part request raised",
			detail: "PR-2026-0062 — fastener kit, routine",
			byUserId: "USR-003",
			tone: "blue"
		}],
		costCentreCode: "LINE-MAINT"
	},
	{
		id: "WO-2026-0029",
		aircraftId: "VH-MSA",
		defectId: "DEF-2026-0041",
		title: "A-Check package — VH-MSA",
		description: "Scheduled A-Check per approved maintenance programme, MEL Hangar 2, 14–18 Jul. Includes zonal inspections, servicing, operational checks and rectification of findings (incl. LH MLG actuator seal — DEF-2026-0041).",
		priority: "Routine",
		status: "In Progress",
		assignedToUserId: "USR-007",
		teamUserIds: ["USR-005"],
		createdByUserId: "USR-003",
		createdAt: "2026-07-10T09:30",
		dueAt: "2026-07-18T17:00",
		scheduledStart: "2026-07-14T07:00",
		scheduledEnd: "2026-07-18T17:00",
		estimatedManhours: 96,
		actualManhours: 41.5,
		partsState: "Issued",
		partRequestIds: ["PR-2026-0057", "PR-2026-0059"],
		inspection: {
			required: true,
			type: "Stage inspections per check package",
			status: "Pending",
			inspectorUserId: "USR-008",
			note: "Zonal stage 1–2 accepted; stage 3 due after MLG actuator seal replacement."
		},
		tasks: [
			{
				seq: 1,
				title: "Open access panels per A-Check zonal listing",
				done: true,
				completedByUserId: "USR-007",
				completedAt: "2026-07-14T09:30",
				manhours: 4
			},
			{
				seq: 2,
				title: "Zonal inspection — fuselage stages 1–2",
				done: true,
				completedByUserId: "USR-007",
				completedAt: "2026-07-14T16:00",
				manhours: 10
			},
			{
				seq: 3,
				title: "Engine servicing — oil, filters, chip detectors",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T11:00",
				note: "No metal on chip detectors",
				manhours: 8
			},
			{
				seq: 4,
				title: "Replace LH MLG actuator gland seal (DEF-2026-0041)",
				done: false,
				note: "Seal kit SK-2907-011 issued — scheduled 16 Jul"
			},
			{
				seq: 5,
				title: "Flight control operational checks",
				done: false
			},
			{
				seq: 6,
				title: "Zonal inspection — wings & empennage stage 3",
				done: false
			},
			{
				seq: 7,
				title: "Close-up, duplicate inspections and panel security",
				done: false
			}
		],
		labour: [
			{
				userId: "USR-007",
				date: "2026-07-14",
				hours: 14,
				note: "Panels and zonal stages 1–2"
			},
			{
				userId: "USR-005",
				date: "2026-07-14",
				hours: 9.5,
				note: "Servicing prep, engine oil and filters"
			},
			{
				userId: "USR-007",
				date: "2026-07-15",
				hours: 10,
				note: "Zonal findings write-up, seal kit prep"
			},
			{
				userId: "USR-005",
				date: "2026-07-15",
				hours: 8,
				note: "Engine servicing completion"
			}
		],
		notes: [{
			byUserId: "USR-007",
			at: "2026-07-14T11:00",
			text: "Hydraulic seep found at LH MLG actuator — raised DEF-2026-0041, folded into this package as task 4."
		}, {
			byUserId: "USR-007",
			at: "2026-07-15T09:15",
			text: "On schedule for 18 Jul completion. Seal replacement tomorrow morning, then stage 3 zonal."
		}],
		attachments: [{
			name: "a-check-package-rev2.pdf",
			kind: "document",
			size: "1.1 MB",
			uploadedByUserId: "USR-003",
			uploadedAt: "2026-07-10T09:35"
		}, {
			name: "zonal-findings-s2.pdf",
			kind: "document",
			size: "640 KB",
			uploadedByUserId: "USR-007",
			uploadedAt: "2026-07-14T16:20"
		}],
		timeline: [
			{
				at: "2026-07-10T09:30",
				title: "Work order created",
				detail: "A-Check scheduled from maintenance programme (ME-2026-041)",
				byUserId: "USR-003",
				tone: "blue"
			},
			{
				at: "2026-07-14T07:00",
				title: "Work started",
				detail: "Aircraft towed to Hangar 2 — availability Under Maintenance",
				byUserId: "USR-007",
				tone: "blue"
			},
			{
				at: "2026-07-14T11:32",
				title: "Finding linked",
				detail: "DEF-2026-0041 added as task 4",
				byUserId: "USR-003",
				tone: "amber",
				refLink: {
					label: "DEF-2026-0041",
					to: "/defects/DEF-2026-0041"
				}
			},
			{
				at: "2026-07-15T08:05",
				title: "Parts issued",
				detail: "Seal kit SK-2907-011, filters — ITX-2026-0209",
				byUserId: "USR-011",
				tone: "green"
			}
		],
		costCentreCode: "HANGAR"
	},
	{
		id: "WO-2026-0038",
		aircraftId: "VH-MSA",
		title: "Cabin door seal replacement — forward entry",
		description: "Replace worn forward entry door seal found during A-Check open-up. Seal DS-5210-118 fitted; pressure-decay inspection outstanding.",
		priority: "Routine",
		status: "Awaiting Inspection",
		assignedToUserId: "USR-005",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-07-14T14:20",
		dueAt: "2026-07-17T12:00",
		scheduledStart: "2026-07-15T07:00",
		scheduledEnd: "2026-07-15T12:00",
		estimatedManhours: 4,
		actualManhours: 3.5,
		partsState: "Issued",
		partRequestIds: [],
		inspection: {
			required: true,
			type: "Independent inspection — door seal seating and rigging",
			status: "Pending",
			inspectorUserId: "USR-014",
			note: "Awaiting D. Reyes — seating check and door rig verification."
		},
		tasks: [
			{
				seq: 1,
				title: "Remove worn door seal",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T08:30",
				manhours: 1
			},
			{
				seq: 2,
				title: "Clean channel and inspect retainer",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T09:10",
				manhours: .5
			},
			{
				seq: 3,
				title: "Install new seal DS-5210-118",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-15T10:45",
				manhours: 1.5
			},
			{
				seq: 4,
				title: "Door rig check and seating inspection",
				done: false
			}
		],
		labour: [{
			userId: "USR-005",
			date: "2026-07-15",
			hours: 3.5,
			note: "Seal replacement, awaiting inspection"
		}],
		notes: [{
			byUserId: "USR-005",
			at: "2026-07-15T10:50",
			text: "New seal installed and seated. Requesting independent inspection before door close-up."
		}],
		attachments: [],
		timeline: [
			{
				at: "2026-07-14T14:20",
				title: "Work order created",
				detail: "A-Check open-up finding",
				byUserId: "USR-003",
				tone: "blue"
			},
			{
				at: "2026-07-15T07:00",
				title: "Work started",
				byUserId: "USR-005",
				tone: "blue"
			},
			{
				at: "2026-07-15T10:50",
				title: "Awaiting inspection",
				detail: "Independent inspection requested — D. Reyes",
				byUserId: "USR-005",
				tone: "orange"
			}
		],
		costCentreCode: "HANGAR"
	},
	{
		id: "WO-2026-0037",
		aircraftId: "VH-BHV",
		title: "100-hr inspection — VH-BHV",
		description: "Scheduled 100-hourly inspection per King Air 350 maintenance schedule. To be performed at MEL GA hangar ahead of Westline charter block starting 22 Jul.",
		priority: "Routine",
		status: "Open",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-07-13T15:40",
		dueAt: "2026-07-21T17:00",
		scheduledStart: "2026-07-21T08:00",
		scheduledEnd: "2026-07-21T17:00",
		estimatedManhours: 14,
		actualManhours: 0,
		partsState: "Not Required",
		partRequestIds: [],
		inspection: {
			required: true,
			type: "Stage inspection per schedule",
			status: "Pending"
		},
		tasks: [
			{
				seq: 1,
				title: "Engine inspection — both PT6A-60A per schedule",
				done: false
			},
			{
				seq: 2,
				title: "Airframe zonal inspection",
				done: false
			},
			{
				seq: 3,
				title: "Landing gear and brake inspection",
				done: false
			},
			{
				seq: 4,
				title: "Avionics operational checks",
				done: false
			},
			{
				seq: 5,
				title: "Servicing and lubrication schedule",
				done: false
			}
		],
		labour: [],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-07-13T15:40",
			title: "Work order created",
			detail: "From maintenance programme (ME-2026-050)",
			byUserId: "USR-003",
			tone: "blue"
		}],
		costCentreCode: "CHARTER-SUP"
	},
	{
		id: "WO-2026-0027",
		aircraftId: "VH-LWK",
		defectId: "DEF-2026-0038",
		title: "Replace weather radar R/T unit",
		description: "Replace faulty weather radar receiver/transmitter per BITE fault isolation. Replacement unit WX-3401-770 on supplier backorder — ETA 18 Jul. Functional test and return-to-service check on completion.",
		priority: "Urgent",
		status: "Awaiting Parts",
		assignedToUserId: "USR-007",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-07-07T10:02",
		dueAt: "2026-07-19T17:00",
		scheduledStart: "2026-07-18T13:00",
		scheduledEnd: "2026-07-19T12:00",
		estimatedManhours: 6,
		actualManhours: 2,
		partsState: "Backordered",
		partRequestIds: ["PR-2026-0058"],
		inspection: {
			required: true,
			type: "Functional test — radar returns verification",
			status: "Pending"
		},
		tasks: [
			{
				seq: 1,
				title: "BITE fault isolation and unit confirmation",
				done: true,
				completedByUserId: "USR-007",
				completedAt: "2026-07-07T12:00",
				manhours: 2
			},
			{
				seq: 2,
				title: "Remove faulty R/T unit",
				done: false
			},
			{
				seq: 3,
				title: "Install replacement WX-3401-770",
				done: false
			},
			{
				seq: 4,
				title: "Functional test — ground returns check",
				done: false
			}
		],
		labour: [{
			userId: "USR-007",
			date: "2026-07-07",
			hours: 2,
			note: "BITE checks and fault isolation"
		}],
		notes: [{
			byUserId: "USR-011",
			at: "2026-07-13T10:20",
			text: "Supplier confirms revised ETA 18 Jul — consignment SPL-88401. Will expedite goods-in inspection on arrival."
		}],
		attachments: [{
			name: "radar-bite-report.pdf",
			kind: "document",
			size: "240 KB",
			uploadedByUserId: "USR-007",
			uploadedAt: "2026-07-07T12:05"
		}],
		timeline: [
			{
				at: "2026-07-07T10:02",
				title: "Work order created",
				detail: "From defect DEF-2026-0038",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "DEF-2026-0038",
					to: "/defects/DEF-2026-0038"
				}
			},
			{
				at: "2026-07-07T10:20",
				title: "Awaiting parts",
				detail: "PR-2026-0058 backordered — Skyparts Logistics",
				byUserId: "USR-011",
				tone: "orange"
			},
			{
				at: "2026-07-13T10:20",
				title: "Supplier update",
				detail: "ETA revised to 18 Jul",
				byUserId: "USR-011",
				tone: "amber"
			}
		],
		costCentreCode: "CHARTER-SUP"
	},
	{
		id: "WO-2026-0031",
		aircraftId: "VH-OYU",
		defectId: "DEF-2026-0042",
		title: "Replace nose gear taxi light lamp",
		description: "Replace unserviceable taxi light lamp on nose landing gear per AMM 33-42-15. Operational check on completion. Aircraft required for full 15 Jul programme — completed overnight 14 Jul.",
		priority: "Routine",
		status: "Closed",
		assignedToUserId: "USR-005",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-07-13T19:12",
		dueAt: "2026-07-14T22:00",
		scheduledStart: "2026-07-14T16:00",
		scheduledEnd: "2026-07-14T18:30",
		estimatedManhours: 1.5,
		actualManhours: 1.1,
		partsState: "Issued",
		partRequestIds: ["PR-2026-0056"],
		inspection: {
			required: false,
			status: "Not Required",
			note: "Single-system lamp replacement — no independent inspection required per policy."
		},
		signOffId: "SO-2026-0018",
		tasks: [
			{
				seq: 1,
				title: "Jack nose gear access — safety locks in place",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-14T16:20",
				manhours: .2
			},
			{
				seq: 2,
				title: "Remove unserviceable taxi light lamp (TL-3342-108)",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-14T16:40",
				manhours: .2
			},
			{
				seq: 3,
				title: "Install serviceable lamp — torque per AMM 33-42-15",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-14T17:20",
				note: "New lamp S/N TL26-04471",
				manhours: .4
			},
			{
				seq: 4,
				title: "Operational check — taxi light ON/OFF from flight deck",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-14T17:50",
				manhours: .2
			},
			{
				seq: 5,
				title: "Close up and record part numbers in log",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-14T17:55",
				manhours: .1
			}
		],
		labour: [{
			userId: "USR-005",
			date: "2026-07-14",
			hours: 1.1,
			note: "Lamp replacement and ops check"
		}],
		notes: [{
			byUserId: "USR-005",
			at: "2026-07-14T17:58",
			text: "Replacement complete, ops check satisfactory. U/S lamp returned to stores under ITX-2026-0208."
		}, {
			byUserId: "USR-014",
			at: "2026-07-14T18:42",
			text: "Work reviewed and certified — released to service under SO-2026-0018."
		}],
		attachments: [{
			name: "taxi-light-installed.jpg",
			kind: "photo",
			size: "1.7 MB",
			uploadedByUserId: "USR-005",
			uploadedAt: "2026-07-14T17:52"
		}],
		timeline: [
			{
				at: "2026-07-13T19:12",
				title: "Work order created",
				detail: "From defect DEF-2026-0042",
				byUserId: "USR-003",
				tone: "blue",
				refLink: {
					label: "DEF-2026-0042",
					to: "/defects/DEF-2026-0042"
				}
			},
			{
				at: "2026-07-13T19:20",
				title: "Assigned",
				detail: "Assigned to J. Munro — overnight slot",
				byUserId: "USR-003",
				tone: "amber"
			},
			{
				at: "2026-07-14T16:00",
				title: "Work started",
				byUserId: "USR-005",
				tone: "blue"
			},
			{
				at: "2026-07-14T16:05",
				title: "Part issued",
				detail: "TL-3342-108 × 1 from MEL Main Store (ITX-2026-0207)",
				byUserId: "USR-011",
				tone: "green"
			},
			{
				at: "2026-07-14T17:55",
				title: "Tasks complete",
				detail: "Ops check satisfactory — ready for certification",
				byUserId: "USR-005",
				tone: "green"
			},
			{
				at: "2026-07-14T18:42",
				title: "Released to service",
				detail: "SO-2026-0018 — Line Release by D. Reyes",
				byUserId: "USR-014",
				tone: "green",
				refLink: {
					label: "Sign-off record",
					to: "/work-orders/WO-2026-0031/sign-off"
				}
			},
			{
				at: "2026-07-14T18:47",
				title: "Work order closed",
				detail: "Defect DEF-2026-0042 closed; VH-OYU returned to Available",
				byUserId: "USR-003",
				tone: "green"
			}
		],
		costCentreCode: "LINE-MAINT"
	},
	{
		id: "WO-2026-0025",
		aircraftId: "VH-JDF",
		title: "Weekly check — VH-JDF",
		description: "Scheduled weekly check per operator maintenance programme.",
		priority: "Routine",
		status: "Closed",
		assignedToUserId: "USR-014",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-07-11T09:00",
		dueAt: "2026-07-12T22:00",
		estimatedManhours: 3,
		actualManhours: 2.8,
		partsState: "Not Required",
		partRequestIds: [],
		inspection: {
			required: false,
			status: "Not Required"
		},
		signOffId: "SO-2026-0017",
		tasks: [{
			seq: 1,
			title: "Weekly check per programme card SF34-WC-06",
			done: true,
			completedByUserId: "USR-014",
			completedAt: "2026-07-12T20:30",
			manhours: 2.8
		}],
		labour: [{
			userId: "USR-014",
			date: "2026-07-12",
			hours: 2.8,
			note: "Weekly check complete — nil findings"
		}],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-07-11T09:00",
			title: "Work order created",
			byUserId: "USR-003",
			tone: "blue"
		}, {
			at: "2026-07-12T21:10",
			title: "Released to service",
			detail: "SO-2026-0017 — Line Release",
			byUserId: "USR-014",
			tone: "green"
		}],
		costCentreCode: "LINE-MAINT"
	},
	{
		id: "WO-2026-0024",
		aircraftId: "VH-QPB",
		defectId: "DEF-2026-0040",
		title: "Replace seat 11A recline lock",
		description: "Replace jammed recline mechanism lock on seat 11A and function-check seat.",
		priority: "Routine",
		status: "Closed",
		assignedToUserId: "USR-005",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-07-08T14:05",
		dueAt: "2026-07-10T17:00",
		estimatedManhours: 2,
		actualManhours: 1.6,
		partsState: "Issued",
		partRequestIds: ["PR-2026-0055"],
		inspection: {
			required: false,
			status: "Not Required"
		},
		signOffId: "SO-2026-0016",
		tasks: [
			{
				seq: 1,
				title: "Remove seat 11A recline lock",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-09T14:30",
				manhours: .7
			},
			{
				seq: 2,
				title: "Install serviceable lock SR-2501-033",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-09T15:20",
				manhours: .7
			},
			{
				seq: 3,
				title: "Function check seat recline",
				done: true,
				completedByUserId: "USR-005",
				completedAt: "2026-07-09T15:45",
				manhours: .2
			}
		],
		labour: [{
			userId: "USR-005",
			date: "2026-07-09",
			hours: 1.6,
			note: "Recline lock replacement"
		}],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-07-08T14:05",
			title: "Work order created",
			detail: "From defect DEF-2026-0040",
			byUserId: "USR-003",
			tone: "blue",
			refLink: {
				label: "DEF-2026-0040",
				to: "/defects/DEF-2026-0040"
			}
		}, {
			at: "2026-07-09T16:20",
			title: "Released to service",
			detail: "SO-2026-0016 — Line Release by N. Petrou",
			byUserId: "USR-008",
			tone: "green"
		}],
		costCentreCode: "LINE-MAINT"
	},
	{
		id: "WO-2026-0022",
		aircraftId: "VH-MSA",
		defectId: "DEF-2026-0035",
		title: "Replace forward cargo net attachment ring",
		description: "Replace worn cargo net attachment ring in forward compartment.",
		priority: "Routine",
		status: "Closed",
		assignedToUserId: "USR-005",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-06-24T09:00",
		dueAt: "2026-06-26T17:00",
		estimatedManhours: 1,
		actualManhours: .9,
		partsState: "Issued",
		partRequestIds: [],
		inspection: {
			required: false,
			status: "Not Required"
		},
		signOffId: "SO-2026-0015",
		tasks: [{
			seq: 1,
			title: "Replace attachment ring CN-2555-021 and proof-check",
			done: true,
			completedByUserId: "USR-005",
			completedAt: "2026-06-25T13:40",
			manhours: .9
		}],
		labour: [{
			userId: "USR-005",
			date: "2026-06-25",
			hours: .9,
			note: "Ring replacement"
		}],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-06-24T09:00",
			title: "Work order created",
			byUserId: "USR-003",
			tone: "blue"
		}, {
			at: "2026-06-25T14:30",
			title: "Released to service",
			detail: "SO-2026-0015 — Line Release by N. Petrou",
			byUserId: "USR-008",
			tone: "green"
		}],
		costCentreCode: "LINE-MAINT"
	},
	{
		id: "WO-2026-0020",
		aircraftId: "VH-BHV",
		title: "100-hr inspection — VH-BHV (May)",
		description: "Scheduled 100-hourly inspection per King Air 350 maintenance schedule.",
		priority: "Routine",
		status: "Closed",
		assignedToUserId: "USR-007",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-05-20T09:00",
		dueAt: "2026-05-27T17:00",
		estimatedManhours: 14,
		actualManhours: 13.2,
		partsState: "Issued",
		partRequestIds: [],
		inspection: {
			required: true,
			type: "Stage inspection",
			status: "Passed",
			inspectorUserId: "USR-008"
		},
		signOffId: "SO-2026-0014",
		tasks: [{
			seq: 1,
			title: "100-hr inspection per schedule — all stages",
			done: true,
			completedByUserId: "USR-007",
			completedAt: "2026-05-26T15:00",
			manhours: 13.2
		}],
		labour: [{
			userId: "USR-007",
			date: "2026-05-26",
			hours: 13.2,
			note: "100-hr inspection"
		}],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-05-20T09:00",
			title: "Work order created",
			byUserId: "USR-003",
			tone: "blue"
		}, {
			at: "2026-05-26T16:45",
			title: "Released to service",
			detail: "SO-2026-0014 — Inspection sign-off by N. Petrou",
			byUserId: "USR-008",
			tone: "green"
		}],
		costCentreCode: "CHARTER-SUP"
	},
	{
		id: "WO-2026-0018",
		aircraftId: "VH-ZNE",
		title: "Engine compressor wash — both engines",
		description: "Scheduled compressor wash, both CT7-9B engines, with post-wash ground run.",
		priority: "Routine",
		status: "Closed",
		assignedToUserId: "USR-005",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-04-20T08:00",
		dueAt: "2026-04-22T17:00",
		estimatedManhours: 5,
		actualManhours: 4.7,
		partsState: "Not Required",
		partRequestIds: [],
		inspection: {
			required: false,
			status: "Not Required"
		},
		signOffId: "SO-2026-0013",
		tasks: [{
			seq: 1,
			title: "Compressor wash and ground run — both engines",
			done: true,
			completedByUserId: "USR-005",
			completedAt: "2026-04-21T15:30",
			manhours: 4.7
		}],
		labour: [{
			userId: "USR-005",
			date: "2026-04-21",
			hours: 4.7,
			note: "Wash and ground run"
		}],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-04-20T08:00",
			title: "Work order created",
			byUserId: "USR-003",
			tone: "blue"
		}, {
			at: "2026-04-21T16:40",
			title: "Released to service",
			detail: "SO-2026-0013 — Line Release by N. Petrou",
			byUserId: "USR-008",
			tone: "green"
		}],
		costCentreCode: "LINE-MAINT"
	},
	{
		id: "WO-2026-0015",
		aircraftId: "VH-KLD",
		title: "Propeller dynamic balance — No.1",
		description: "Dynamic balance of No.1 propeller following vibration report; balance achieved within limits.",
		priority: "Routine",
		status: "Closed",
		assignedToUserId: "USR-007",
		teamUserIds: [],
		createdByUserId: "USR-003",
		createdAt: "2026-03-10T09:00",
		dueAt: "2026-03-13T17:00",
		estimatedManhours: 6,
		actualManhours: 5.5,
		partsState: "Not Required",
		partRequestIds: [],
		inspection: {
			required: false,
			status: "Not Required"
		},
		signOffId: "SO-2026-0012",
		tasks: [{
			seq: 1,
			title: "Dynamic balance runs and weight adjustment",
			done: true,
			completedByUserId: "USR-007",
			completedAt: "2026-03-12T14:00",
			manhours: 5.5
		}],
		labour: [{
			userId: "USR-007",
			date: "2026-03-12",
			hours: 5.5,
			note: "Balance achieved 0.08 IPS"
		}],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-03-10T09:00",
			title: "Work order created",
			byUserId: "USR-003",
			tone: "blue"
		}, {
			at: "2026-03-12T15:10",
			title: "Released to service",
			detail: "SO-2026-0012 — Line Release by D. Reyes",
			byUserId: "USR-014",
			tone: "green"
		}],
		costCentreCode: "LINE-MAINT"
	},
	{
		id: "WO-2026-0012",
		aircraftId: "VH-OYU",
		title: "A-Check package — VH-OYU (Feb)",
		description: "Scheduled A-Check per approved maintenance programme, MEL Hangar 2.",
		priority: "Routine",
		status: "Closed",
		assignedToUserId: "USR-007",
		teamUserIds: ["USR-005"],
		createdByUserId: "USR-003",
		createdAt: "2026-02-10T09:00",
		dueAt: "2026-02-19T17:00",
		estimatedManhours: 92,
		actualManhours: 96.5,
		partsState: "Issued",
		partRequestIds: [],
		inspection: {
			required: true,
			type: "Stage inspections per check package",
			status: "Passed",
			inspectorUserId: "USR-014"
		},
		signOffId: "SO-2026-0011",
		tasks: [{
			seq: 1,
			title: "A-Check package all stages incl. findings rectification",
			done: true,
			completedByUserId: "USR-007",
			completedAt: "2026-02-18T16:00",
			manhours: 96.5
		}],
		labour: [{
			userId: "USR-007",
			date: "2026-02-18",
			hours: 52,
			note: "Zonal and rectification"
		}, {
			userId: "USR-005",
			date: "2026-02-18",
			hours: 44.5,
			note: "Servicing and ops checks"
		}],
		notes: [],
		attachments: [],
		timeline: [{
			at: "2026-02-10T09:00",
			title: "Work order created",
			byUserId: "USR-003",
			tone: "blue"
		}, {
			at: "2026-02-18T17:30",
			title: "Released to service",
			detail: "SO-2026-0011 — Return to Service by D. Reyes",
			byUserId: "USR-014",
			tone: "green"
		}],
		costCentreCode: "HANGAR"
	}
];
//#endregion
//#region src/data/signOffs.ts
var CERT_STATEMENT = "I certify that the work described on this work order has been carried out in accordance with the applicable maintenance data and operator procedures, and in respect of that work the aircraft is released to service.";
var signOffs = [
	{
		id: "SO-2026-0018",
		aircraftId: "VH-OYU",
		workOrderId: "WO-2026-0031",
		type: "Line Release",
		signedByUserId: "USR-014",
		licenceNumber: "CASA LAME 442871",
		signedAt: "2026-07-14T18:42",
		statement: CERT_STATEMENT,
		releaseStatus: "Released",
		auditState: "Verified"
	},
	{
		id: "SO-2026-0017",
		aircraftId: "VH-JDF",
		workOrderId: "WO-2026-0025",
		type: "Line Release",
		signedByUserId: "USR-014",
		licenceNumber: "CASA LAME 442871",
		signedAt: "2026-07-12T21:10",
		statement: CERT_STATEMENT,
		releaseStatus: "Released",
		auditState: "Verified"
	},
	{
		id: "SO-2026-0016",
		aircraftId: "VH-QPB",
		workOrderId: "WO-2026-0024",
		type: "Line Release",
		signedByUserId: "USR-008",
		licenceNumber: "CASA LAME 398214",
		signedAt: "2026-07-09T16:20",
		statement: CERT_STATEMENT,
		releaseStatus: "Released",
		auditState: "Verified"
	},
	{
		id: "SO-2026-0015",
		aircraftId: "VH-MSA",
		workOrderId: "WO-2026-0022",
		type: "Line Release",
		signedByUserId: "USR-008",
		licenceNumber: "CASA LAME 398214",
		signedAt: "2026-06-25T14:30",
		statement: CERT_STATEMENT,
		releaseStatus: "Released",
		auditState: "Verified"
	},
	{
		id: "SO-2026-0014",
		aircraftId: "VH-BHV",
		workOrderId: "WO-2026-0020",
		type: "Inspection",
		signedByUserId: "USR-008",
		licenceNumber: "CASA LAME 398214",
		signedAt: "2026-05-26T16:45",
		statement: "I certify that the 100-hourly inspection has been completed in accordance with the approved schedule and the aircraft is released to service in respect of that inspection.",
		releaseStatus: "Released",
		auditState: "Verified"
	},
	{
		id: "SO-2026-0013",
		aircraftId: "VH-ZNE",
		workOrderId: "WO-2026-0018",
		type: "Line Release",
		signedByUserId: "USR-008",
		licenceNumber: "CASA LAME 398214",
		signedAt: "2026-04-21T16:40",
		statement: CERT_STATEMENT,
		releaseStatus: "Released",
		auditState: "Verified"
	},
	{
		id: "SO-2026-0012",
		aircraftId: "VH-KLD",
		workOrderId: "WO-2026-0015",
		type: "Line Release",
		signedByUserId: "USR-014",
		licenceNumber: "CASA LAME 442871",
		signedAt: "2026-03-12T15:10",
		statement: CERT_STATEMENT,
		releaseStatus: "Released",
		auditState: "Verified"
	},
	{
		id: "SO-2026-0011",
		aircraftId: "VH-OYU",
		workOrderId: "WO-2026-0012",
		type: "Return to Service",
		signedByUserId: "USR-014",
		licenceNumber: "CASA LAME 442871",
		signedAt: "2026-02-18T17:30",
		statement: "I certify that the A-Check package and associated rectifications have been carried out in accordance with the applicable maintenance data, and the aircraft is released to service.",
		limitations: "Nil.",
		releaseStatus: "Released",
		auditState: "Verified"
	}
];
var maintenanceRecords = [
	{
		id: "MR-2026-0118",
		aircraftId: "VH-OYU",
		workOrderId: "WO-2026-0031",
		defectId: "DEF-2026-0042",
		recordType: "Corrective",
		summary: "Nose gear taxi light lamp replaced (TL-3342-108). Operational check satisfactory.",
		performedByUserId: "USR-005",
		certifiedByUserId: "USR-014",
		performedAt: "2026-07-14T18:42",
		totalManhours: 1.1,
		partsUsedSummary: "TL-3342-108 × 1",
		reference: "SO-2026-0018"
	},
	{
		id: "MR-2026-0116",
		aircraftId: "VH-JDF",
		workOrderId: "WO-2026-0025",
		recordType: "Inspection",
		summary: "Weekly check per programme card SF34-WC-06 — nil findings.",
		performedByUserId: "USR-014",
		certifiedByUserId: "USR-014",
		performedAt: "2026-07-12T21:10",
		totalManhours: 2.8,
		partsUsedSummary: "—",
		reference: "SO-2026-0017"
	},
	{
		id: "MR-2026-0112",
		aircraftId: "VH-QPB",
		workOrderId: "WO-2026-0024",
		defectId: "DEF-2026-0040",
		recordType: "Corrective",
		summary: "Seat 11A recline lock replaced (SR-2501-033); seat function checked serviceable.",
		performedByUserId: "USR-005",
		certifiedByUserId: "USR-008",
		performedAt: "2026-07-09T16:20",
		totalManhours: 1.6,
		partsUsedSummary: "SR-2501-033 × 1",
		reference: "SO-2026-0016"
	},
	{
		id: "MR-2026-0104",
		aircraftId: "VH-MSA",
		workOrderId: "WO-2026-0022",
		defectId: "DEF-2026-0035",
		recordType: "Corrective",
		summary: "Forward cargo net attachment ring replaced (CN-2555-021) and proof-checked.",
		performedByUserId: "USR-005",
		certifiedByUserId: "USR-008",
		performedAt: "2026-06-25T14:30",
		totalManhours: .9,
		partsUsedSummary: "CN-2555-021 × 1",
		reference: "SO-2026-0015"
	},
	{
		id: "MR-2026-0092",
		aircraftId: "VH-BHV",
		workOrderId: "WO-2026-0020",
		recordType: "Scheduled",
		summary: "100-hourly inspection completed per King Air 350 schedule — findings rectified.",
		performedByUserId: "USR-007",
		certifiedByUserId: "USR-008",
		performedAt: "2026-05-26T16:45",
		totalManhours: 13.2,
		partsUsedSummary: "Filters and consumables per schedule",
		reference: "SO-2026-0014"
	},
	{
		id: "MR-2026-0071",
		aircraftId: "VH-ZNE",
		workOrderId: "WO-2026-0018",
		recordType: "Scheduled",
		summary: "Compressor wash both engines with post-wash ground run — performance recovered.",
		performedByUserId: "USR-005",
		certifiedByUserId: "USR-008",
		performedAt: "2026-04-21T16:40",
		totalManhours: 4.7,
		partsUsedSummary: "Wash fluid 24 L",
		reference: "SO-2026-0013"
	},
	{
		id: "MR-2026-0055",
		aircraftId: "VH-KLD",
		workOrderId: "WO-2026-0015",
		recordType: "Corrective",
		summary: "No.1 propeller dynamic balance — final 0.08 IPS, within limits.",
		performedByUserId: "USR-007",
		certifiedByUserId: "USR-014",
		performedAt: "2026-03-12T15:10",
		totalManhours: 5.5,
		partsUsedSummary: "Balance weights per chart",
		reference: "SO-2026-0012"
	},
	{
		id: "MR-2026-0031",
		aircraftId: "VH-OYU",
		workOrderId: "WO-2026-0012",
		recordType: "Scheduled",
		summary: "A-Check package completed incl. findings rectification. Returned to service.",
		performedByUserId: "USR-007",
		certifiedByUserId: "USR-014",
		performedAt: "2026-02-18T17:30",
		totalManhours: 96.5,
		partsUsedSummary: "Per check package parts listing",
		reference: "SO-2026-0011"
	}
];
//#endregion
//#region src/data/people.ts
/** The signed-in preview user (Licensed Engineer at MEL). */
var CURRENT_USER_ID = "USR-014";
var users = [
	{
		id: "USR-001",
		name: "Marcus Hale",
		email: "marcus.hale@aerosync.example",
		role: "Admin",
		title: "Systems & Compliance Manager",
		status: "Active",
		securityProfileIds: ["SP-001"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 3 9010 2201",
		lastLoginAt: "2026-07-15T08:12",
		lastLoginSource: "203.42.118.4 · Melbourne, AU",
		createdAt: "2025-02-03T09:00"
	},
	{
		id: "USR-002",
		name: "Priya Raman",
		email: "priya.raman@aerosync.example",
		role: "Fleet Planner",
		title: "Senior Fleet Planner",
		status: "Active",
		securityProfileIds: ["SP-002"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 3 9010 2214",
		lastLoginAt: "2026-07-15T06:41",
		lastLoginSource: "203.42.118.4 · Melbourne, AU",
		createdAt: "2025-02-10T09:00"
	},
	{
		id: "USR-003",
		name: "Elena Voss",
		email: "elena.voss@aerosync.example",
		role: "Maintenance Controller",
		title: "Duty Maintenance Controller",
		status: "Active",
		securityProfileIds: ["SP-003"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 3 9010 2230",
		lastLoginAt: "2026-07-15T05:58",
		lastLoginSource: "203.42.118.4 · Melbourne, AU",
		createdAt: "2025-02-10T09:00"
	},
	{
		id: "USR-004",
		name: "Rachel Torres",
		email: "rachel.torres@aerosync.example",
		role: "Accounts Officer",
		title: "Commercial Accounts Officer",
		status: "Active",
		securityProfileIds: ["SP-009"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 3 9010 2262",
		lastLoginAt: "2026-07-14T16:20",
		lastLoginSource: "203.42.118.4 · Melbourne, AU",
		createdAt: "2025-04-01T09:00"
	},
	{
		id: "USR-005",
		name: "Jack Munro",
		email: "jack.munro@aerosync.example",
		role: "Engineer",
		title: "Line Maintenance Engineer",
		status: "Active",
		securityProfileIds: ["SP-004"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 428 330 118",
		lastLoginAt: "2026-07-15T11:47",
		lastLoginSource: "10.20.4.61 · Line iPad, MEL",
		createdAt: "2025-03-02T09:00"
	},
	{
		id: "USR-006",
		name: "Leo Andersson",
		email: "leo.andersson@aerosync.example",
		role: "Auditor",
		title: "Quality & Audit Officer",
		status: "Active",
		securityProfileIds: ["SP-008"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 3 9010 2288",
		lastLoginAt: "2026-07-13T14:05",
		lastLoginSource: "203.42.118.4 · Melbourne, AU",
		createdAt: "2025-06-11T09:00"
	},
	{
		id: "USR-007",
		name: "Sofia Grech",
		email: "sofia.grech@aerosync.example",
		role: "Engineer",
		title: "Hangar Maintenance Engineer",
		status: "Active",
		securityProfileIds: ["SP-004", "SP-010"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 411 902 774",
		lastLoginAt: "2026-07-15T07:05",
		lastLoginSource: "10.20.4.44 · Hangar 2 kiosk, MEL",
		createdAt: "2025-03-02T09:00"
	},
	{
		id: "USR-008",
		name: "Nadia Petrou",
		email: "nadia.petrou@aerosync.example",
		role: "Licensed Engineer",
		title: "Licensed Aircraft Maintenance Engineer",
		status: "Active",
		securityProfileIds: ["SP-004", "SP-005"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 400 218 553",
		licenceNumber: "CASA LAME 398214",
		lastLoginAt: "2026-07-14T21:34",
		lastLoginSource: "10.20.4.61 · Line iPad, MEL",
		createdAt: "2025-02-24T09:00"
	},
	{
		id: "USR-009",
		name: "Tom Iredale",
		email: "tom.iredale@aerosync.example",
		role: "Pilot",
		title: "Captain, ATR 72",
		status: "Active",
		securityProfileIds: ["SP-006"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 417 660 902",
		lastLoginAt: "2026-07-15T08:04",
		lastLoginSource: "Crew mobile app",
		createdAt: "2025-03-20T09:00"
	},
	{
		id: "USR-010",
		name: "Aisha Khan",
		email: "aisha.khan@aerosync.example",
		role: "Pilot",
		title: "First Officer, Dash 8",
		status: "Invited",
		securityProfileIds: ["SP-006"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 402 118 373",
		createdAt: "2026-07-12T10:15"
	},
	{
		id: "USR-011",
		name: "Ben Okafor",
		email: "ben.okafor@aerosync.example",
		role: "Stores Officer",
		title: "Stores & Logistics Officer",
		status: "Active",
		securityProfileIds: ["SP-007"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 3 9010 2251",
		lastLoginAt: "2026-07-15T09:22",
		lastLoginSource: "10.20.6.12 · Stores terminal, MEL",
		createdAt: "2025-05-05T09:00"
	},
	{
		id: "USR-012",
		name: "Grace Liu",
		email: "grace.liu@aerosync.example",
		role: "Engineer",
		title: "Line Maintenance Engineer",
		status: "Suspended",
		securityProfileIds: ["SP-004"],
		accountId: "ACC-001",
		base: "MQL",
		phone: "+61 419 204 886",
		lastLoginAt: "2026-06-28T15:10",
		lastLoginSource: "10.30.2.8 · Line laptop, MQL",
		createdAt: "2025-08-18T09:00"
	},
	{
		id: "USR-014",
		name: "Daniel Reyes",
		email: "daniel.reyes@aerosync.example",
		role: "Licensed Engineer",
		title: "Licensed Aircraft Maintenance Engineer",
		status: "Active",
		securityProfileIds: ["SP-004", "SP-005"],
		accountId: "ACC-001",
		base: "MEL",
		phone: "+61 400 771 244",
		licenceNumber: "CASA LAME 442871",
		lastLoginAt: "2026-07-15T12:02",
		lastLoginSource: "10.20.4.61 · Line iPad, MEL",
		createdAt: "2025-02-24T09:00"
	}
];
/**
* Permission matrix vocabulary. Columns are the action set used by the
* profile editor preview; not every action applies to every domain.
*/
var permissionDomains = [
	{
		key: "aircraft",
		label: "Aircraft",
		description: "Registry records, status and archiving",
		actions: [
			{
				key: "view",
				label: "View"
			},
			{
				key: "create",
				label: "Create"
			},
			{
				key: "edit",
				label: "Edit"
			},
			{
				key: "archive",
				label: "Archive"
			}
		]
	},
	{
		key: "fleet_plan",
		label: "Fleet planning",
		description: "Availability board, plans and assignment",
		actions: [
			{
				key: "view",
				label: "View"
			},
			{
				key: "create",
				label: "Create"
			},
			{
				key: "edit",
				label: "Edit"
			},
			{
				key: "approve",
				label: "Approve"
			}
		]
	},
	{
		key: "defect",
		label: "Defects",
		description: "Reporting, review, deferral and closure",
		actions: [
			{
				key: "view",
				label: "View"
			},
			{
				key: "create",
				label: "Create"
			},
			{
				key: "review",
				label: "Review"
			},
			{
				key: "defer",
				label: "Defer"
			},
			{
				key: "close",
				label: "Close"
			}
		]
	},
	{
		key: "work_order",
		label: "Work orders",
		description: "Creation, assignment, task updates and closure",
		actions: [
			{
				key: "view",
				label: "View"
			},
			{
				key: "create",
				label: "Create"
			},
			{
				key: "assign",
				label: "Assign"
			},
			{
				key: "update",
				label: "Update"
			},
			{
				key: "close",
				label: "Close"
			}
		]
	},
	{
		key: "inventory",
		label: "Inventory",
		description: "Stock visibility, requests, issue and return",
		actions: [
			{
				key: "view",
				label: "View"
			},
			{
				key: "request",
				label: "Request"
			},
			{
				key: "issue",
				label: "Issue"
			},
			{
				key: "adjust",
				label: "Adjust"
			}
		]
	},
	{
		key: "signoff",
		label: "Sign-off",
		description: "Release to service and record viewing",
		actions: [{
			key: "view",
			label: "View"
		}, {
			key: "perform",
			label: "Perform"
		}]
	},
	{
		key: "accounts",
		label: "Accounts",
		description: "Customer accounts, cost centres and billing",
		actions: [
			{
				key: "view",
				label: "View"
			},
			{
				key: "create",
				label: "Create"
			},
			{
				key: "edit",
				label: "Edit"
			}
		]
	},
	{
		key: "users",
		label: "Users",
		description: "User admin, invitations and suspension",
		actions: [
			{
				key: "view",
				label: "View"
			},
			{
				key: "create",
				label: "Create"
			},
			{
				key: "edit",
				label: "Edit"
			},
			{
				key: "suspend",
				label: "Suspend"
			}
		]
	},
	{
		key: "security_profiles",
		label: "Security profiles",
		description: "Permission bundles and assignments",
		actions: [
			{
				key: "view",
				label: "View"
			},
			{
				key: "create",
				label: "Create"
			},
			{
				key: "edit",
				label: "Edit"
			}
		]
	},
	{
		key: "audit_logs",
		label: "Audit logs",
		description: "System-wide activity trail",
		actions: [{
			key: "view",
			label: "View"
		}]
	},
	{
		key: "reports",
		label: "Reports",
		description: "Operational reporting and exports",
		actions: [{
			key: "view",
			label: "View"
		}, {
			key: "export",
			label: "Export"
		}]
	}
];
function grants(map) {
	return Object.entries(map).flatMap(([domain, actions]) => actions.map((a) => `${domain}.${a}`));
}
var securityProfiles = [
	{
		id: "SP-001",
		name: "System Administrator",
		description: "Full administration of users, profiles, configuration and all operational modules.",
		typicalRole: "Admin",
		isSystem: true,
		updatedAt: "2026-05-02T10:12",
		updatedByUserId: "USR-001",
		permissions: grants(Object.fromEntries(permissionDomains.map((d) => [d.key, d.actions.map((a) => a.key)])))
	},
	{
		id: "SP-002",
		name: "Fleet Planner - Standard",
		description: "Availability board, fleet plans and flight assignment with read access to defects and aircraft.",
		typicalRole: "Fleet Planner",
		isSystem: true,
		updatedAt: "2026-03-18T09:40",
		updatedByUserId: "USR-001",
		permissions: grants({
			aircraft: ["view"],
			fleet_plan: [
				"view",
				"create",
				"edit",
				"approve"
			],
			defect: ["view"],
			work_order: ["view"],
			signoff: ["view"],
			reports: ["view"]
		})
	},
	{
		id: "SP-003",
		name: "Maintenance Controller",
		description: "Defect triage, deferral, work-order creation and assignment across the fleet.",
		typicalRole: "Maintenance Controller",
		isSystem: true,
		updatedAt: "2026-04-22T15:03",
		updatedByUserId: "USR-001",
		permissions: grants({
			aircraft: ["view", "edit"],
			fleet_plan: ["view"],
			defect: [
				"view",
				"create",
				"review",
				"defer",
				"close"
			],
			work_order: [
				"view",
				"create",
				"assign",
				"update",
				"close"
			],
			inventory: ["view", "request"],
			signoff: ["view"],
			audit_logs: ["view"],
			reports: ["view"]
		})
	},
	{
		id: "SP-004",
		name: "Line Engineer - MEL",
		description: "Update assigned work orders, record labour, report defects and raise part requests at Melbourne line.",
		typicalRole: "Engineer",
		isSystem: true,
		updatedAt: "2026-02-09T08:30",
		updatedByUserId: "USR-001",
		permissions: grants({
			aircraft: ["view"],
			defect: ["view", "create"],
			work_order: ["view", "update"],
			inventory: ["view", "request"],
			signoff: ["view"]
		})
	},
	{
		id: "SP-005",
		name: "Licensed Engineer - Release",
		description: "Engineer capabilities plus authority to perform release-to-service sign-off.",
		typicalRole: "Licensed Engineer",
		isSystem: true,
		updatedAt: "2026-02-09T08:31",
		updatedByUserId: "USR-001",
		permissions: grants({
			aircraft: ["view"],
			defect: [
				"view",
				"create",
				"close"
			],
			work_order: [
				"view",
				"update",
				"close"
			],
			inventory: ["view", "request"],
			signoff: ["view", "perform"]
		})
	},
	{
		id: "SP-006",
		name: "Pilot - Line Report",
		description: "Report defects from the line with flight context and track their status.",
		typicalRole: "Pilot",
		isSystem: true,
		updatedAt: "2026-02-09T08:32",
		updatedByUserId: "USR-001",
		permissions: grants({
			aircraft: ["view"],
			defect: ["view", "create"]
		})
	},
	{
		id: "SP-007",
		name: "Stores Officer",
		description: "Full inventory operations: stock visibility, issue, return, transfer and adjustment.",
		typicalRole: "Stores Officer",
		isSystem: true,
		updatedAt: "2026-05-30T11:18",
		updatedByUserId: "USR-001",
		permissions: grants({
			aircraft: ["view"],
			work_order: ["view"],
			inventory: [
				"view",
				"request",
				"issue",
				"adjust"
			],
			reports: ["view"]
		})
	},
	{
		id: "SP-008",
		name: "Auditor - Read Only",
		description: "Read-only visibility of operational data plus the full audit trail and reports.",
		typicalRole: "Auditor",
		isSystem: true,
		updatedAt: "2026-06-11T09:02",
		updatedByUserId: "USR-001",
		permissions: grants({
			aircraft: ["view"],
			fleet_plan: ["view"],
			defect: ["view"],
			work_order: ["view"],
			inventory: ["view"],
			signoff: ["view"],
			accounts: ["view"],
			users: ["view"],
			security_profiles: ["view"],
			audit_logs: ["view"],
			reports: ["view", "export"]
		})
	},
	{
		id: "SP-009",
		name: "Accounts Officer",
		description: "Customer accounts, cost centres and commercial reporting; no maintenance mutations.",
		typicalRole: "Accounts Officer",
		isSystem: true,
		updatedAt: "2026-04-04T13:47",
		updatedByUserId: "USR-001",
		permissions: grants({
			aircraft: ["view"],
			work_order: ["view"],
			accounts: [
				"view",
				"create",
				"edit"
			],
			reports: ["view", "export"]
		})
	},
	{
		id: "SP-010",
		name: "Hangar Engineer - No Finance",
		description: "Custom profile: hangar work-order execution incl. assignment, with account and cost data hidden.",
		typicalRole: "Engineer",
		isSystem: false,
		updatedAt: "2026-07-01T16:25",
		updatedByUserId: "USR-001",
		permissions: grants({
			aircraft: ["view"],
			defect: ["view", "create"],
			work_order: [
				"view",
				"assign",
				"update"
			],
			inventory: ["view", "request"],
			signoff: ["view"]
		})
	}
];
//#endregion
//#region src/data/inventory.ts
var parts$1 = [
	{
		id: "HP-2977-201",
		description: "Engine-driven hydraulic pump, PW127M",
		manufacturer: "Parker Meggitt",
		category: "Hydraulics",
		ataChapter: "29",
		effectivity: "ATR 72-600",
		unitOfMeasure: "Each",
		reorderLevel: 1,
		stockState: "Low Stock",
		unitCost: 18400,
		active: true
	},
	{
		id: "SK-2907-011",
		description: "MLG retraction actuator seal kit",
		manufacturer: "Safran Landing Systems",
		category: "Hydraulics",
		ataChapter: "29",
		effectivity: "DHC-8-300",
		unitOfMeasure: "Kit",
		reorderLevel: 2,
		stockState: "In Stock",
		unitCost: 640,
		active: true
	},
	{
		id: "TL-3342-108",
		description: "Taxi light lamp, sealed beam 28V",
		manufacturer: "Whelen Aerospace",
		category: "Lighting",
		ataChapter: "33",
		effectivity: "ATR 72-600",
		unitOfMeasure: "Each",
		reorderLevel: 4,
		stockState: "In Stock",
		unitCost: 185,
		active: true
	},
	{
		id: "LL-3342-215",
		description: "Landing light lamp, sealed beam 600W",
		manufacturer: "Whelen Aerospace",
		category: "Lighting",
		ataChapter: "33",
		effectivity: "DHC-8-300",
		unitOfMeasure: "Each",
		reorderLevel: 4,
		stockState: "Low Stock",
		unitCost: 310,
		active: true
	},
	{
		id: "WX-3401-770",
		description: "Weather radar receiver/transmitter unit",
		manufacturer: "Collins Aerospace",
		category: "Avionics",
		ataChapter: "34",
		effectivity: "King Air 350",
		unitOfMeasure: "Each",
		reorderLevel: 0,
		stockState: "Out of Stock",
		unitCost: 26900,
		active: true
	},
	{
		id: "SW-2310-004",
		description: "Static discharge wick, trailing edge",
		manufacturer: "Dayton-Granger",
		category: "Electrical",
		ataChapter: "23",
		effectivity: "All types",
		unitOfMeasure: "Each",
		reorderLevel: 10,
		stockState: "In Stock",
		unitCost: 46,
		active: true
	},
	{
		id: "WB-3302-114",
		description: "Windscreen wiper blade assembly",
		manufacturer: "Rosemount Aerospace",
		category: "Ice & Rain",
		ataChapter: "30",
		effectivity: "ATR 72-600",
		unitOfMeasure: "Each",
		reorderLevel: 3,
		stockState: "In Stock",
		unitCost: 220,
		active: true
	},
	{
		id: "TF-2551-040",
		description: "Cabin trim panel fastener kit",
		manufacturer: "Saab Support",
		category: "Interiors",
		ataChapter: "25",
		effectivity: "Saab 340B",
		unitOfMeasure: "Kit",
		reorderLevel: 2,
		stockState: "Low Stock",
		unitCost: 95,
		active: true
	},
	{
		id: "SR-2501-033",
		description: "Seat recline lock mechanism",
		manufacturer: "Geven",
		category: "Interiors",
		ataChapter: "25",
		effectivity: "DHC-8-300",
		unitOfMeasure: "Each",
		reorderLevel: 2,
		stockState: "In Stock",
		unitCost: 410,
		active: true
	},
	{
		id: "DS-5210-118",
		description: "Entry door seal, forward",
		manufacturer: "De Havilland Canada",
		category: "Structures",
		ataChapter: "52",
		effectivity: "DHC-8-300",
		unitOfMeasure: "Each",
		reorderLevel: 1,
		stockState: "In Stock",
		unitCost: 1240,
		active: true
	},
	{
		id: "BR-3244-561",
		description: "Main wheel brake assembly",
		manufacturer: "Safran Landing Systems",
		category: "Landing Gear",
		ataChapter: "32",
		effectivity: "ATR 72-600",
		unitOfMeasure: "Each",
		reorderLevel: 2,
		stockState: "In Stock",
		unitCost: 7850,
		active: true
	},
	{
		id: "MT-3245-702",
		description: "Main wheel tyre 30×8.8 R15",
		manufacturer: "Michelin Aviation",
		category: "Landing Gear",
		ataChapter: "32",
		effectivity: "ATR 72 / DHC-8",
		unitOfMeasure: "Each",
		reorderLevel: 6,
		stockState: "In Stock",
		unitCost: 1980,
		active: true
	},
	{
		id: "PB-3061-118",
		description: "Propeller de-ice boot",
		manufacturer: "Collins Aerospace",
		category: "Ice & Rain",
		ataChapter: "30",
		effectivity: "Saab 340B",
		unitOfMeasure: "Each",
		reorderLevel: 2,
		stockState: "Quarantine",
		unitCost: 3120,
		active: true
	},
	{
		id: "OF-7921-330",
		description: "Engine oil filter, PW127M",
		manufacturer: "Pratt & Whitney Canada",
		category: "Powerplant",
		ataChapter: "79",
		effectivity: "ATR 72-600",
		unitOfMeasure: "Each",
		reorderLevel: 8,
		stockState: "In Stock",
		unitCost: 165,
		active: true
	},
	{
		id: "OF-7921-118",
		description: "Engine oil filter, PW123E",
		manufacturer: "Pratt & Whitney Canada",
		category: "Powerplant",
		ataChapter: "79",
		effectivity: "DHC-8-300",
		unitOfMeasure: "Each",
		reorderLevel: 8,
		stockState: "In Stock",
		unitCost: 158,
		active: true
	},
	{
		id: "EO-1210-005",
		description: "Turbine engine oil, 5W (quart)",
		manufacturer: "Mobil Jet",
		category: "Consumables",
		ataChapter: "12",
		effectivity: "All types",
		unitOfMeasure: "Litre",
		reorderLevel: 48,
		stockState: "In Stock",
		unitCost: 21,
		active: true
	},
	{
		id: "EB-2562-090",
		description: "ELT battery pack",
		manufacturer: "Artex",
		category: "Emergency Equipment",
		ataChapter: "25",
		effectivity: "All types",
		unitOfMeasure: "Each",
		reorderLevel: 3,
		stockState: "Low Stock",
		unitCost: 480,
		active: true
	},
	{
		id: "FC-2620-114",
		description: "Fire bottle discharge cartridge",
		manufacturer: "Kidde Aerospace",
		category: "Fire Protection",
		ataChapter: "26",
		effectivity: "ATR 72 / DHC-8",
		unitOfMeasure: "Each",
		reorderLevel: 4,
		stockState: "In Stock",
		unitCost: 720,
		active: true
	},
	{
		id: "NL-3342-077",
		description: "Navigation light lens, LH red",
		manufacturer: "Whelen Aerospace",
		category: "Lighting",
		ataChapter: "33",
		effectivity: "All types",
		unitOfMeasure: "Each",
		reorderLevel: 3,
		stockState: "In Stock",
		unitCost: 130,
		active: true
	},
	{
		id: "CN-2555-021",
		description: "Cargo net attachment ring",
		manufacturer: "AmSafe Bridport",
		category: "Interiors",
		ataChapter: "25",
		effectivity: "DHC-8-300",
		unitOfMeasure: "Each",
		reorderLevel: 4,
		stockState: "In Stock",
		unitCost: 84,
		active: true
	}
];
var stockLevels = [
	{
		partId: "HP-2977-201",
		warehouse: "MEL Main Store",
		bin: "H-02-A",
		serviceable: 0,
		unserviceable: 1,
		reserved: 0,
		lowStock: true
	},
	{
		partId: "SK-2907-011",
		warehouse: "MEL Main Store",
		bin: "H-04-C",
		serviceable: 3,
		unserviceable: 0,
		reserved: 1,
		lowStock: false
	},
	{
		partId: "TL-3342-108",
		warehouse: "MEL Main Store",
		bin: "L-01-B",
		serviceable: 6,
		unserviceable: 1,
		reserved: 0,
		lowStock: false
	},
	{
		partId: "TL-3342-108",
		warehouse: "MQL Line Locker",
		bin: "LL-03",
		serviceable: 1,
		unserviceable: 0,
		reserved: 0,
		lowStock: false
	},
	{
		partId: "LL-3342-215",
		warehouse: "MEL Main Store",
		bin: "L-01-C",
		serviceable: 2,
		unserviceable: 1,
		reserved: 0,
		lowStock: true
	},
	{
		partId: "WX-3401-770",
		warehouse: "MEL Main Store",
		bin: "AV-07-A",
		serviceable: 0,
		unserviceable: 1,
		reserved: 0,
		lowStock: true
	},
	{
		partId: "SW-2310-004",
		warehouse: "MEL Main Store",
		bin: "E-02-D",
		serviceable: 18,
		unserviceable: 0,
		reserved: 2,
		lowStock: false
	},
	{
		partId: "SW-2310-004",
		warehouse: "MEL Line Cart 1",
		bin: "C1-04",
		serviceable: 4,
		unserviceable: 0,
		reserved: 0,
		lowStock: false
	},
	{
		partId: "WB-3302-114",
		warehouse: "MEL Main Store",
		bin: "IR-01-A",
		serviceable: 5,
		unserviceable: 0,
		reserved: 1,
		lowStock: false
	},
	{
		partId: "TF-2551-040",
		warehouse: "MEL Main Store",
		bin: "IN-03-B",
		serviceable: 2,
		unserviceable: 0,
		reserved: 1,
		lowStock: true
	},
	{
		partId: "SR-2501-033",
		warehouse: "MEL Main Store",
		bin: "IN-02-A",
		serviceable: 3,
		unserviceable: 0,
		reserved: 0,
		lowStock: false
	},
	{
		partId: "DS-5210-118",
		warehouse: "MEL Main Store",
		bin: "S-05-A",
		serviceable: 1,
		unserviceable: 0,
		reserved: 0,
		lowStock: false
	},
	{
		partId: "BR-3244-561",
		warehouse: "MEL Main Store",
		bin: "LG-01-A",
		serviceable: 3,
		unserviceable: 1,
		reserved: 0,
		lowStock: false
	},
	{
		partId: "MT-3245-702",
		warehouse: "MEL Main Store",
		bin: "LG-02-B",
		serviceable: 9,
		unserviceable: 2,
		reserved: 2,
		lowStock: false
	},
	{
		partId: "PB-3061-118",
		warehouse: "MEL Quarantine",
		bin: "Q-01",
		serviceable: 0,
		unserviceable: 2,
		reserved: 0,
		lowStock: true
	},
	{
		partId: "OF-7921-330",
		warehouse: "MEL Main Store",
		bin: "P-03-A",
		serviceable: 14,
		unserviceable: 0,
		reserved: 2,
		lowStock: false
	},
	{
		partId: "OF-7921-118",
		warehouse: "MEL Main Store",
		bin: "P-03-B",
		serviceable: 11,
		unserviceable: 0,
		reserved: 4,
		lowStock: false
	},
	{
		partId: "EO-1210-005",
		warehouse: "MEL Main Store",
		bin: "CN-01",
		serviceable: 96,
		unserviceable: 0,
		reserved: 12,
		lowStock: false
	},
	{
		partId: "EO-1210-005",
		warehouse: "MEL Line Cart 1",
		bin: "C1-01",
		serviceable: 12,
		unserviceable: 0,
		reserved: 0,
		lowStock: false
	},
	{
		partId: "EB-2562-090",
		warehouse: "MEL Main Store",
		bin: "EM-01-A",
		serviceable: 2,
		unserviceable: 1,
		reserved: 2,
		lowStock: true
	},
	{
		partId: "FC-2620-114",
		warehouse: "MEL Main Store",
		bin: "F-01-A",
		serviceable: 6,
		unserviceable: 0,
		reserved: 0,
		lowStock: false
	},
	{
		partId: "NL-3342-077",
		warehouse: "MEL Main Store",
		bin: "L-02-A",
		serviceable: 4,
		unserviceable: 0,
		reserved: 0,
		lowStock: false
	},
	{
		partId: "CN-2555-021",
		warehouse: "MEL Main Store",
		bin: "IN-04-C",
		serviceable: 7,
		unserviceable: 0,
		reserved: 0,
		lowStock: false
	}
];
var inventoryTransactions = [
	{
		id: "ITX-2026-0212",
		type: "Transfer",
		partId: "HP-2977-201",
		quantity: 1,
		workOrderId: "WO-2026-0033",
		aircraftId: "VH-RXT",
		performedByUserId: "USR-011",
		performedAt: "2026-07-15T11:30",
		fromLocation: "MEL Main Store",
		toLocation: "MQL Line Locker",
		reference: "Road freight CON-88417",
		notes: "AOG recovery — serviceable EDP to MQL for WO-2026-0033. ETA 17:30."
	},
	{
		id: "ITX-2026-0211",
		type: "Issue",
		partId: "SW-2310-004",
		quantity: 2,
		aircraftId: "VH-JDF",
		performedByUserId: "USR-011",
		performedAt: "2026-07-15T10:40",
		fromLocation: "MEL Line Cart 1",
		toLocation: "VH-JDF (line)",
		reference: "DEF-2026-0045 assessment",
		notes: "Wicks staged for evening rectification window at MEL."
	},
	{
		id: "ITX-2026-0210",
		type: "Issue",
		partId: "LL-3342-215",
		quantity: 1,
		workOrderId: "WO-2026-0035",
		aircraftId: "VH-TRW",
		performedByUserId: "USR-011",
		performedAt: "2026-07-15T09:10",
		fromLocation: "MEL Main Store",
		toLocation: "VH-TRW (Bay 4)",
		reference: "PR-2026-0060"
	},
	{
		id: "ITX-2026-0209",
		type: "Issue",
		partId: "SK-2907-011",
		quantity: 1,
		workOrderId: "WO-2026-0029",
		aircraftId: "VH-MSA",
		performedByUserId: "USR-011",
		performedAt: "2026-07-15T08:05",
		fromLocation: "MEL Main Store",
		toLocation: "Hangar 2",
		reference: "PR-2026-0059",
		notes: "Issued with engine filters for A-Check package."
	},
	{
		id: "ITX-2026-0208",
		type: "Return",
		partId: "TL-3342-108",
		quantity: 1,
		workOrderId: "WO-2026-0031",
		aircraftId: "VH-OYU",
		performedByUserId: "USR-011",
		performedAt: "2026-07-14T19:05",
		fromLocation: "VH-OYU (Bay 12)",
		toLocation: "MEL Main Store",
		reference: "U/S return — tag 26-0441",
		notes: "Failed lamp returned unserviceable for disposal."
	},
	{
		id: "ITX-2026-0207",
		type: "Issue",
		partId: "TL-3342-108",
		quantity: 1,
		workOrderId: "WO-2026-0031",
		aircraftId: "VH-OYU",
		performedByUserId: "USR-011",
		performedAt: "2026-07-14T16:05",
		fromLocation: "MEL Main Store",
		toLocation: "VH-OYU (Bay 12)",
		reference: "PR-2026-0056"
	},
	{
		id: "ITX-2026-0206",
		type: "Adjustment",
		partId: "EO-1210-005",
		quantity: -4,
		performedByUserId: "USR-011",
		performedAt: "2026-07-14T14:20",
		fromLocation: "MEL Main Store",
		toLocation: "MEL Main Store",
		reference: "Stocktake 14 Jul",
		notes: "Cycle count variance — four quarts written off (damaged packaging)."
	},
	{
		id: "ITX-2026-0205",
		type: "Receipt",
		partId: "MT-3245-702",
		quantity: 4,
		performedByUserId: "USR-011",
		performedAt: "2026-07-13T11:15",
		fromLocation: "Skyparts Logistics",
		toLocation: "MEL Main Store",
		reference: "PO-2026-0341",
		notes: "Goods-in inspection passed — certs filed."
	}
];
var partRequests = [
	{
		id: "PR-2026-0062",
		workOrderId: "WO-2026-0032",
		aircraftId: "VH-ZNE",
		partId: "TF-2551-040",
		quantity: 1,
		urgency: "Routine",
		requestedByUserId: "USR-003",
		requestedAt: "2026-07-14T08:10",
		status: "Approved",
		requiredBy: "2026-07-21T17:00",
		note: "For deferred defect rectification at 21 Jul line visit."
	},
	{
		id: "PR-2026-0061",
		workOrderId: "WO-2026-0033",
		aircraftId: "VH-RXT",
		partId: "HP-2977-201",
		quantity: 1,
		urgency: "AOG",
		requestedByUserId: "USR-005",
		requestedAt: "2026-07-15T08:40",
		status: "In Transit",
		requiredBy: "2026-07-16T08:00",
		note: "AOG VH-RXT at MQL — road freight CON-88417, ETA 17:30 today."
	},
	{
		id: "PR-2026-0060",
		workOrderId: "WO-2026-0035",
		aircraftId: "VH-TRW",
		partId: "LL-3342-215",
		quantity: 1,
		urgency: "Urgent",
		requestedByUserId: "USR-005",
		requestedAt: "2026-07-14T21:55",
		status: "Issued",
		requiredBy: "2026-07-15T09:00"
	},
	{
		id: "PR-2026-0059",
		workOrderId: "WO-2026-0029",
		aircraftId: "VH-MSA",
		partId: "SK-2907-011",
		quantity: 1,
		urgency: "Routine",
		requestedByUserId: "USR-007",
		requestedAt: "2026-07-14T11:40",
		status: "Issued",
		requiredBy: "2026-07-16T07:00",
		note: "MLG actuator seal — DEF-2026-0041 rectification within A-Check."
	},
	{
		id: "PR-2026-0058",
		workOrderId: "WO-2026-0027",
		aircraftId: "VH-LWK",
		partId: "WX-3401-770",
		quantity: 1,
		urgency: "Urgent",
		requestedByUserId: "USR-007",
		requestedAt: "2026-07-07T10:15",
		status: "Backordered",
		requiredBy: "2026-07-18T12:00",
		note: "Supplier ETA 18 Jul — consignment SPL-88401."
	},
	{
		id: "PR-2026-0057",
		workOrderId: "WO-2026-0029",
		aircraftId: "VH-MSA",
		partId: "OF-7921-118",
		quantity: 4,
		urgency: "Routine",
		requestedByUserId: "USR-005",
		requestedAt: "2026-07-13T15:00",
		status: "Issued",
		requiredBy: "2026-07-14T07:00"
	},
	{
		id: "PR-2026-0056",
		workOrderId: "WO-2026-0031",
		aircraftId: "VH-OYU",
		partId: "TL-3342-108",
		quantity: 1,
		urgency: "Urgent",
		requestedByUserId: "USR-005",
		requestedAt: "2026-07-13T19:30",
		status: "Issued",
		requiredBy: "2026-07-14T16:00"
	},
	{
		id: "PR-2026-0055",
		workOrderId: "WO-2026-0024",
		aircraftId: "VH-QPB",
		partId: "SR-2501-033",
		quantity: 1,
		urgency: "Routine",
		requestedByUserId: "USR-005",
		requestedAt: "2026-07-08T14:30",
		status: "Issued",
		requiredBy: "2026-07-09T12:00"
	}
];
//#endregion
//#region src/data/accounts.ts
var accounts = [
	{
		id: "ACC-001",
		name: "AeroSync Regional Operations",
		code: "ASR",
		type: "Operator",
		status: "Active",
		primaryContact: {
			name: "Marcus Hale",
			title: "Systems & Compliance Manager",
			email: "marcus.hale@aerosync.example",
			phone: "+61 3 9010 2201"
		},
		billingAddress: "Hangar 2, 41 Apollo Drive, Melbourne Airport VIC 3045",
		billingState: "Internal",
		currentCostMtd: 148230,
		aircraftIds: [
			"VH-OYU",
			"VH-KLD",
			"VH-RXT",
			"VH-MSA",
			"VH-QPB",
			"VH-TRW",
			"VH-ZNE",
			"VH-JDF"
		],
		costCentres: [
			{
				code: "LINE-MAINT",
				name: "Line Maintenance",
				description: "Line rectification and daily/weekly checks across the network",
				spend: 46810,
				budget: 62e3,
				aircraftIds: [
					"VH-OYU",
					"VH-KLD",
					"VH-QPB",
					"VH-TRW",
					"VH-ZNE",
					"VH-JDF"
				],
				workOrderIds: [
					"WO-2026-0031",
					"WO-2026-0035",
					"WO-2026-0036",
					"WO-2026-0032",
					"WO-2026-0024",
					"WO-2026-0025"
				],
				status: "Active"
			},
			{
				code: "HANGAR",
				name: "Hangar & Scheduled Checks",
				description: "A-Checks and heavier scheduled maintenance at MEL Hangar 2",
				spend: 71540,
				budget: 9e4,
				aircraftIds: ["VH-MSA", "VH-OYU"],
				workOrderIds: [
					"WO-2026-0029",
					"WO-2026-0038",
					"WO-2026-0012"
				],
				status: "Active"
			},
			{
				code: "AOG-RECOVERY",
				name: "AOG Recovery",
				description: "Unplanned grounding recovery incl. freight and travel",
				spend: 24660,
				budget: 3e4,
				aircraftIds: ["VH-RXT"],
				workOrderIds: ["WO-2026-0033"],
				status: "Active"
			},
			{
				code: "TRAINING",
				name: "Training & Competency",
				description: "Engineer type training and authorisation renewals",
				spend: 5220,
				budget: 18e3,
				aircraftIds: [],
				workOrderIds: [],
				status: "Active"
			}
		],
		notes: "Internal operator account — all AeroSync-owned tails and maintenance cost centres.",
		since: "2025-02-01",
		activity: [
			{
				at: "2026-07-15T08:20",
				title: "AOG cost event opened",
				detail: "WO-2026-0033 attributed to AOG-RECOVERY",
				tone: "red"
			},
			{
				at: "2026-07-14T18:47",
				title: "Work order closed",
				detail: "WO-2026-0031 — $612 labour and parts to LINE-MAINT",
				tone: "green"
			},
			{
				at: "2026-07-10T09:30",
				title: "A-Check package opened",
				detail: "WO-2026-0029 forecast $28,400 to HANGAR",
				tone: "blue"
			},
			{
				at: "2026-07-01T10:00",
				title: "July budgets published",
				detail: "Cost centre budgets loaded by R. Torres",
				tone: "grey"
			}
		]
	},
	{
		id: "ACC-002",
		name: "Westline Charter Pty Ltd",
		code: "WLC",
		type: "Customer",
		status: "Active",
		primaryContact: {
			name: "Fiona Marsh",
			title: "Operations Director",
			email: "fiona.marsh@westline.example",
			phone: "+61 2 8011 4402"
		},
		billingAddress: "Suite 12, 200 Kent Street, Sydney NSW 2000",
		billingState: "Current",
		currentCostMtd: 21470,
		aircraftIds: ["VH-BHV", "VH-LWK"],
		costCentres: [{
			code: "CHARTER-SUP",
			name: "Charter Support",
			description: "Managed maintenance for Westline King Air fleet",
			spend: 21470,
			budget: 26e3,
			aircraftIds: ["VH-BHV", "VH-LWK"],
			workOrderIds: [
				"WO-2026-0027",
				"WO-2026-0037",
				"WO-2026-0020"
			],
			status: "Active"
		}],
		notes: "Managed-maintenance customer — two King Air 350s under continuing airworthiness agreement CAMO-2025-11.",
		since: "2025-06-15",
		activity: [
			{
				at: "2026-07-13T10:20",
				title: "Backorder escalation",
				detail: "WX-3401-770 ETA revised to 18 Jul — customer notified",
				tone: "orange"
			},
			{
				at: "2026-07-08T09:00",
				title: "June invoice settled",
				detail: "INV-2026-0209 — $19,840 received",
				tone: "green"
			},
			{
				at: "2026-07-06T14:00",
				title: "Defect raised on VH-LWK",
				detail: "Weather radar intermittent — DEF-2026-0038",
				tone: "blue"
			}
		]
	},
	{
		id: "ACC-003",
		name: "Riverina Ag Services",
		code: "RAS",
		type: "Customer",
		status: "Active",
		primaryContact: {
			name: "Dale Hutchins",
			title: "Chief Pilot",
			email: "dale@riverina-ag.example",
			phone: "+61 429 887 210"
		},
		billingAddress: "84 Airfield Road, Griffith NSW 2680",
		billingState: "Overdue",
		currentCostMtd: 6180,
		aircraftIds: [],
		costCentres: [{
			code: "ADHOC-LINE",
			name: "Ad-hoc Line Support",
			description: "Casual line maintenance for visiting aircraft at GFF",
			spend: 6180,
			budget: 8e3,
			aircraftIds: [],
			workOrderIds: [],
			status: "Active"
		}],
		notes: "Third-party line support at Griffith. Invoice INV-2026-0195 overdue 21 days — finance following up.",
		since: "2025-09-08",
		activity: [{
			at: "2026-07-12T11:00",
			title: "Payment reminder issued",
			detail: "INV-2026-0195 — $4,720 now 21 days overdue",
			tone: "red"
		}, {
			at: "2026-06-30T16:30",
			title: "June support summary sent",
			detail: "Four line callouts at GFF",
			tone: "grey"
		}]
	},
	{
		id: "ACC-004",
		name: "Skyparts Logistics",
		code: "SPL",
		type: "Supplier",
		status: "Active",
		primaryContact: {
			name: "Irene Papadakis",
			title: "Account Manager",
			email: "irene.p@skyparts.example",
			phone: "+61 3 9330 7788"
		},
		billingAddress: "19 Freight Loop, Tullamarine VIC 3043",
		billingState: "Current",
		currentCostMtd: 34120,
		aircraftIds: [],
		costCentres: [],
		notes: "Primary rotables and consumables supplier. Open consignment SPL-88401 (radar R/T unit, ETA 18 Jul).",
		since: "2025-03-01",
		activity: [
			{
				at: "2026-07-13T11:15",
				title: "Goods received",
				detail: "PO-2026-0341 — four main tyres passed goods-in",
				tone: "green"
			},
			{
				at: "2026-07-13T10:20",
				title: "Backorder update",
				detail: "WX-3401-770 consignment SPL-88401 ETA 18 Jul",
				tone: "orange"
			},
			{
				at: "2026-07-02T09:40",
				title: "Quarantine raised",
				detail: "Two prop de-ice boots quarantined pending cert review",
				tone: "amber"
			}
		]
	}
];
//#endregion
//#region src/data/fleetPlans.ts
var fleetPlans = [
	{
		id: "FP-2026-0715",
		name: "Week 29 Fleet Plan (13–19 Jul)",
		status: "Published",
		startDate: "2026-07-13",
		endDate: "2026-07-19",
		base: "MEL",
		description: "Published operating plan for week 29. Full regional schedule with VH-MSA in planned A-Check (14–18 Jul). Charter cover for Westline retained on VH-BHV.",
		createdByUserId: "USR-002",
		approvedByUserId: "USR-001",
		approvedAt: "2026-07-10T15:30",
		updatedAt: "2026-07-15T08:30",
		aircraftIds: [
			"VH-OYU",
			"VH-KLD",
			"VH-RXT",
			"VH-QPB",
			"VH-TRW",
			"VH-ZNE",
			"VH-JDF",
			"VH-BHV"
		],
		flightIds: [
			"ASR-201",
			"ASR-204",
			"ASR-206",
			"ASR-208",
			"ASR-210",
			"ASR-211",
			"ASR-212",
			"ASR-213",
			"ASR-214",
			"ASR-215",
			"ASR-222",
			"ASR-226",
			"ASR-231",
			"ASR-236",
			"ASR-241",
			"ASR-243",
			"ASR-291",
			"ASR-252",
			"ASR-254",
			"ASR-258",
			"ASR-262"
		],
		revisions: [
			{
				version: 4,
				at: "2026-07-15T08:30",
				byUserId: "USR-002",
				note: "VH-RXT AOG — ASR-226 cancelled, ASR-258 unassigned pending recovery"
			},
			{
				version: 3,
				at: "2026-07-14T10:15",
				byUserId: "USR-002",
				note: "VH-TRW held for WO-2026-0035 rectification; ASR-241 flagged At Risk"
			},
			{
				version: 2,
				at: "2026-07-10T15:30",
				byUserId: "USR-001",
				note: "Plan approved and published"
			},
			{
				version: 1,
				at: "2026-07-08T11:00",
				byUserId: "USR-002",
				note: "Draft created from week 28 template"
			}
		],
		conflicts: [
			{
				severity: "Critical",
				message: "VH-RXT is AOG at MQL — ASR-258 (16 Jul) has no assigned aircraft",
				aircraftId: "VH-RXT",
				flightId: "ASR-258"
			},
			{
				severity: "Warning",
				message: "VH-TRW awaiting sign-off — release required by 17:30 for ASR-241",
				aircraftId: "VH-TRW",
				flightId: "ASR-241"
			},
			{
				severity: "Warning",
				message: "VH-ZNE operating with deferred defect DEF-2026-0039 — daily reinspection required",
				aircraftId: "VH-ZNE",
				flightId: "ASR-231"
			}
		],
		notes: "Recovery priority: VH-RXT pump replacement (target 16 Jul 14:00). VH-KLD held as evening cover for ASR-241."
	},
	{
		id: "FP-2026-0722",
		name: "Week 30 Fleet Plan (20–26 Jul)",
		status: "Draft",
		startDate: "2026-07-20",
		endDate: "2026-07-26",
		base: "MEL",
		description: "Draft for week 30. Assumes VH-MSA return from A-Check on 18 Jul and VH-RXT recovery. VH-BHV blocked 21 Jul for 100-hr inspection; VH-ZNE trim rectification on 21 Jul evening.",
		createdByUserId: "USR-002",
		updatedAt: "2026-07-14T16:45",
		aircraftIds: [
			"VH-OYU",
			"VH-KLD",
			"VH-RXT",
			"VH-MSA",
			"VH-QPB",
			"VH-TRW",
			"VH-ZNE",
			"VH-JDF",
			"VH-BHV"
		],
		flightIds: [],
		revisions: [{
			version: 2,
			at: "2026-07-14T16:45",
			byUserId: "USR-002",
			note: "Blocked VH-BHV for ME-2026-050 (100-hr) and VH-ZNE for trim refit"
		}, {
			version: 1,
			at: "2026-07-13T09:20",
			byUserId: "USR-002",
			note: "Draft created"
		}],
		conflicts: [{
			severity: "Warning",
			message: "VH-RXT recovery unconfirmed — week 30 utilisation assumes release by 17 Jul",
			aircraftId: "VH-RXT"
		}],
		notes: "Awaiting confirmation of VH-RXT release before submitting for approval."
	},
	{
		id: "FP-2026-0729",
		name: "Week 31 Fleet Plan (27 Jul – 2 Aug)",
		status: "Draft",
		startDate: "2026-07-27",
		endDate: "2026-08-02",
		base: "MEL",
		description: "Early draft for week 31 — school-holiday uplift on MQL and ABX rotations, pending crewing confirmation.",
		createdByUserId: "USR-002",
		updatedAt: "2026-07-13T14:10",
		aircraftIds: [
			"VH-OYU",
			"VH-KLD",
			"VH-RXT",
			"VH-MSA",
			"VH-QPB",
			"VH-TRW",
			"VH-ZNE",
			"VH-JDF"
		],
		flightIds: [],
		revisions: [{
			version: 1,
			at: "2026-07-13T14:10",
			byUserId: "USR-002",
			note: "Draft created"
		}],
		conflicts: []
	},
	{
		id: "FP-2026-0708",
		name: "Week 28 Fleet Plan (6–12 Jul)",
		status: "Archived",
		startDate: "2026-07-06",
		endDate: "2026-07-12",
		base: "MEL",
		description: "Completed week 28 plan — archived. VH-LWK removed from charter programme 6 Jul (weather radar defect).",
		createdByUserId: "USR-002",
		approvedByUserId: "USR-001",
		approvedAt: "2026-07-03T15:00",
		updatedAt: "2026-07-13T08:00",
		aircraftIds: [
			"VH-OYU",
			"VH-KLD",
			"VH-RXT",
			"VH-MSA",
			"VH-QPB",
			"VH-TRW",
			"VH-ZNE",
			"VH-JDF",
			"VH-BHV",
			"VH-LWK"
		],
		flightIds: [],
		revisions: [
			{
				version: 3,
				at: "2026-07-13T08:00",
				byUserId: "USR-002",
				note: "Week closed — archived"
			},
			{
				version: 2,
				at: "2026-07-06T15:20",
				byUserId: "USR-002",
				note: "VH-LWK withdrawn — DEF-2026-0038"
			},
			{
				version: 1,
				at: "2026-07-03T15:00",
				byUserId: "USR-001",
				note: "Plan approved and published"
			}
		],
		conflicts: []
	}
];
var maintenanceEvents = [
	{
		id: "ME-2026-041",
		aircraftId: "VH-MSA",
		checkType: "A-Check",
		description: "Scheduled A-Check package incl. zonal inspections and findings rectification",
		plannedStart: "2026-07-14T07:00",
		plannedEnd: "2026-07-18T17:00",
		downtimeHours: 106,
		facility: "MEL Hangar 2",
		planningRisk: "On Track",
		status: "In Progress",
		workOrderId: "WO-2026-0029"
	},
	{
		id: "ME-2026-044",
		aircraftId: "VH-OYU",
		checkType: "Weekly Check",
		description: "Weekly check per operator maintenance programme",
		plannedStart: "2026-07-15T21:30",
		plannedEnd: "2026-07-16T00:30",
		downtimeHours: 3,
		facility: "MEL Line — Bay 12",
		planningRisk: "On Track",
		status: "Scheduled",
		workOrderId: "WO-2026-0036"
	},
	{
		id: "ME-2026-045",
		aircraftId: "VH-KLD",
		checkType: "Weekly Check",
		description: "Weekly check per operator maintenance programme",
		plannedStart: "2026-07-17T20:00",
		plannedEnd: "2026-07-17T23:00",
		downtimeHours: 3,
		facility: "MEL Line — Bay 9",
		planningRisk: "On Track",
		status: "Scheduled"
	},
	{
		id: "ME-2026-046",
		aircraftId: "VH-RXT",
		checkType: "AOG Recovery",
		description: "No.2 EDP replacement, leak check and independent inspection",
		plannedStart: "2026-07-16T08:00",
		plannedEnd: "2026-07-16T13:00",
		downtimeHours: 5,
		facility: "MQL Apron 2 (line team deployed)",
		planningRisk: "At Risk",
		status: "Scheduled",
		workOrderId: "WO-2026-0033"
	},
	{
		id: "ME-2026-047",
		aircraftId: "VH-ZNE",
		checkType: "Deferred Defect Rectification",
		description: "Row 4 trim panel refit — clears deferral DEF-2026-0039",
		plannedStart: "2026-07-21T18:00",
		plannedEnd: "2026-07-21T19:30",
		downtimeHours: 1.5,
		facility: "MEL Line — Bay 3",
		planningRisk: "Monitor",
		status: "Scheduled",
		workOrderId: "WO-2026-0032"
	},
	{
		id: "ME-2026-048",
		aircraftId: "VH-JDF",
		checkType: "ELT Battery Replacement",
		description: "ELT battery pack replacement — due date driven",
		plannedStart: "2026-07-28T09:00",
		plannedEnd: "2026-07-28T11:00",
		downtimeHours: 2,
		facility: "MEL Line — Bay 3",
		planningRisk: "Monitor",
		status: "Scheduled"
	},
	{
		id: "ME-2026-049",
		aircraftId: "VH-TRW",
		checkType: "Weekly Check",
		description: "Weekly check per operator maintenance programme",
		plannedStart: "2026-07-19T20:00",
		plannedEnd: "2026-07-19T23:00",
		downtimeHours: 3,
		facility: "MEL Line — Bay 4",
		planningRisk: "On Track",
		status: "Scheduled"
	},
	{
		id: "ME-2026-050",
		aircraftId: "VH-BHV",
		checkType: "100-hr Inspection",
		description: "King Air 350 100-hourly inspection ahead of Westline charter block",
		plannedStart: "2026-07-21T08:00",
		plannedEnd: "2026-07-21T17:00",
		downtimeHours: 9,
		facility: "MEL GA Hangar",
		planningRisk: "On Track",
		status: "Scheduled",
		workOrderId: "WO-2026-0037"
	},
	{
		id: "ME-2026-051",
		aircraftId: "VH-LWK",
		checkType: "Phase Inspection",
		description: "Phase inspection — to be combined with radar R/T functional test",
		plannedStart: "2026-08-04T08:00",
		plannedEnd: "2026-08-05T17:00",
		downtimeHours: 33,
		facility: "MEL GA Hangar",
		planningRisk: "Monitor",
		status: "Scheduled"
	}
];
//#endregion
//#region src/data/audit.ts
var auditLogs = [
	{
		id: "AUD-2026-18422",
		at: "2026-07-15T12:02",
		userId: "USR-014",
		role: "Licensed Engineer",
		action: "auth.login",
		entityType: "Session",
		entityRef: "USR-014",
		entityLink: "/admin/users/USR-014",
		summary: "User signed in from line iPad",
		sourceIp: "10.20.4.61",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18419",
		at: "2026-07-15T11:32",
		userId: "USR-005",
		role: "Engineer",
		action: "defect.create",
		entityType: "Defect",
		entityRef: "DEF-2026-0048",
		entityLink: "/defects/DEF-2026-0048",
		summary: "Defect reported — navigation database card expired (VH-BHV)",
		after: {
			status: "Reported",
			severity: "Significant",
			aircraft: "VH-BHV"
		},
		sourceIp: "10.20.4.61",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18415",
		at: "2026-07-15T11:30",
		userId: "USR-011",
		role: "Stores Officer",
		action: "inventory.transfer",
		entityType: "Inventory transaction",
		entityRef: "ITX-2026-0212",
		entityLink: "/inventory/transactions",
		summary: "EDP HP-2977-201 transferred MEL → MQL for AOG recovery",
		before: {
			location: "MEL Main Store",
			reserved: "0"
		},
		after: {
			location: "MQL Line Locker (in transit)",
			reserved: "1"
		},
		sourceIp: "10.20.6.12",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18410",
		at: "2026-07-15T10:35",
		userId: "USR-005",
		role: "Engineer",
		action: "work_order.update",
		entityType: "Work order",
		entityRef: "WO-2026-0035",
		entityLink: "/work-orders/WO-2026-0035",
		summary: "Work order set Ready for Sign-off; availability → Awaiting Sign-off",
		before: {
			status: "In Progress",
			availability: "Under Maintenance"
		},
		after: {
			status: "Ready for Sign-off",
			availability: "Awaiting Sign-off"
		},
		sourceIp: "10.20.4.61",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18404",
		at: "2026-07-15T09:10",
		userId: "USR-011",
		role: "Stores Officer",
		action: "inventory.issue",
		entityType: "Inventory transaction",
		entityRef: "ITX-2026-0210",
		entityLink: "/inventory/transactions",
		summary: "Landing light lamp LL-3342-215 issued to WO-2026-0035",
		sourceIp: "10.20.6.12",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18401",
		at: "2026-07-15T08:30",
		userId: "USR-002",
		role: "Fleet Planner",
		action: "fleet_plan.edit",
		entityType: "Fleet plan",
		entityRef: "FP-2026-0715",
		entityLink: "/fleet/plans/FP-2026-0715",
		summary: "Plan revised — ASR-226 cancelled, ASR-258 unassigned (VH-RXT AOG)",
		before: {
			revision: "3",
			"ASR-226": "VH-RXT",
			"ASR-258": "VH-RXT"
		},
		after: {
			revision: "4",
			"ASR-226": "Cancelled",
			"ASR-258": "Unassigned"
		},
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18396",
		at: "2026-07-15T08:15",
		userId: "USR-003",
		role: "Maintenance Controller",
		action: "work_order.create",
		entityType: "Work order",
		entityRef: "WO-2026-0033",
		entityLink: "/work-orders/WO-2026-0033",
		summary: "AOG work order created from DEF-2026-0044 (VH-RXT)",
		after: {
			status: "Open",
			priority: "AOG",
			aircraft: "VH-RXT"
		},
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18394",
		at: "2026-07-15T07:55",
		userId: "USR-003",
		role: "Maintenance Controller",
		action: "aircraft.status_change",
		entityType: "Aircraft",
		entityRef: "VH-RXT",
		entityLink: "/aircraft/VH-RXT",
		summary: "Aircraft grounded — availability set to AOG",
		before: {
			status: "Serviceable",
			availability: "Assigned"
		},
		after: {
			status: "AOG",
			availability: "AOG"
		},
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18392",
		at: "2026-07-15T07:41",
		userId: "USR-009",
		role: "Pilot",
		action: "defect.create",
		entityType: "Defect",
		entityRef: "DEF-2026-0044",
		entityLink: "/defects/DEF-2026-0044",
		summary: "Critical defect reported — No.2 hydraulic pump low pressure (VH-RXT)",
		after: {
			status: "Reported",
			severity: "Critical",
			aircraft: "VH-RXT"
		},
		sourceIp: "Crew mobile app",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18388",
		at: "2026-07-15T06:41",
		userId: "USR-002",
		role: "Fleet Planner",
		action: "auth.login",
		entityType: "Session",
		entityRef: "USR-002",
		entityLink: "/admin/users/USR-002",
		summary: "User signed in",
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18371",
		at: "2026-07-14T18:47",
		userId: "USR-003",
		role: "Maintenance Controller",
		action: "work_order.close",
		entityType: "Work order",
		entityRef: "WO-2026-0031",
		entityLink: "/work-orders/WO-2026-0031",
		summary: "Work order closed on sign-off; defect DEF-2026-0042 closed; VH-OYU → Available",
		before: {
			status: "Ready for Sign-off",
			defect: "Rectified",
			availability: "Awaiting Sign-off"
		},
		after: {
			status: "Closed",
			defect: "Closed",
			availability: "Available"
		},
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18370",
		at: "2026-07-14T18:42",
		userId: "USR-014",
		role: "Licensed Engineer",
		action: "signoff.perform",
		entityType: "Sign-off",
		entityRef: "SO-2026-0018",
		entityLink: "/work-orders/WO-2026-0031/sign-off",
		summary: "Line release certified for WO-2026-0031 (VH-OYU) — licence CASA LAME 442871",
		after: {
			type: "Line Release",
			release: "Released",
			workOrder: "WO-2026-0031"
		},
		sourceIp: "10.20.4.61",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18359",
		at: "2026-07-14T16:05",
		userId: "USR-011",
		role: "Stores Officer",
		action: "inventory.issue",
		entityType: "Inventory transaction",
		entityRef: "ITX-2026-0207",
		entityLink: "/inventory/transactions",
		summary: "Taxi light lamp TL-3342-108 issued to WO-2026-0031",
		sourceIp: "10.20.6.12",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18344",
		at: "2026-07-14T10:15",
		userId: "USR-002",
		role: "Fleet Planner",
		action: "fleet_plan.edit",
		entityType: "Fleet plan",
		entityRef: "FP-2026-0715",
		entityLink: "/fleet/plans/FP-2026-0715",
		summary: "ASR-241 flagged At Risk — VH-TRW held for WO-2026-0035",
		before: {
			revision: "2",
			"ASR-241 risk": "Clear"
		},
		after: {
			revision: "3",
			"ASR-241 risk": "At Risk"
		},
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18339",
		at: "2026-07-14T09:05",
		userId: "USR-003",
		role: "Maintenance Controller",
		action: "work_order.assign",
		entityType: "Work order",
		entityRef: "WO-2026-0036",
		entityLink: "/work-orders/WO-2026-0036",
		summary: "Weekly check assigned to D. Reyes",
		before: {
			assignee: "Unassigned",
			status: "Open"
		},
		after: {
			assignee: "USR-014 (D. Reyes)",
			status: "Assigned"
		},
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18322",
		at: "2026-07-13T19:12",
		userId: "USR-003",
		role: "Maintenance Controller",
		action: "work_order.create",
		entityType: "Work order",
		entityRef: "WO-2026-0031",
		entityLink: "/work-orders/WO-2026-0031",
		summary: "Work order created from DEF-2026-0042 (taxi light, VH-OYU)",
		after: {
			status: "Open",
			priority: "Routine",
			aircraft: "VH-OYU"
		},
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18320",
		at: "2026-07-13T18:22",
		userId: "USR-009",
		role: "Pilot",
		action: "defect.create",
		entityType: "Defect",
		entityRef: "DEF-2026-0042",
		entityLink: "/defects/DEF-2026-0042",
		summary: "Defect reported — nose gear taxi light unserviceable (VH-OYU)",
		after: {
			status: "Reported",
			severity: "Minor",
			aircraft: "VH-OYU"
		},
		sourceIp: "Crew mobile app",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18310",
		at: "2026-07-13T15:44",
		userId: "USR-012",
		role: "Engineer",
		action: "auth.login",
		entityType: "Session",
		entityRef: "USR-012",
		entityLink: "/admin/users/USR-012",
		summary: "Sign-in blocked — account suspended",
		sourceIp: "10.30.2.8",
		outcome: "Denied"
	},
	{
		id: "AUD-2026-18288",
		at: "2026-07-12T10:15",
		userId: "USR-001",
		role: "Admin",
		action: "users.create",
		entityType: "User",
		entityRef: "USR-010",
		entityLink: "/admin/users/USR-010",
		summary: "User invited — Aisha Khan (Pilot), profile SP-006",
		after: {
			status: "Invited",
			role: "Pilot",
			profiles: "SP-006"
		},
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18262",
		at: "2026-07-11T10:30",
		userId: "USR-003",
		role: "Maintenance Controller",
		action: "defect.defer",
		entityType: "Defect",
		entityRef: "DEF-2026-0039",
		entityLink: "/defects/DEF-2026-0039",
		summary: "Defect deferred to 22 Jul under DDG-25-04; VH-ZNE → Restricted",
		before: {
			status: "Under Review",
			aircraft: "Serviceable"
		},
		after: {
			status: "Deferred",
			aircraft: "Restricted",
			until: "2026-07-22"
		},
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18201",
		at: "2026-07-01T16:25",
		userId: "USR-001",
		role: "Admin",
		action: "security_profiles.edit",
		entityType: "Security profile",
		entityRef: "SP-010",
		entityLink: "/admin/security-profiles/SP-010",
		summary: "Custom profile updated — added work_order.assign to Hangar Engineer - No Finance",
		before: { permissions: "11 grants" },
		after: { permissions: "12 grants (+ work_order.assign)" },
		sourceIp: "203.42.118.4",
		outcome: "Success"
	},
	{
		id: "AUD-2026-18188",
		at: "2026-06-28T15:12",
		userId: "USR-001",
		role: "Admin",
		action: "users.suspend",
		entityType: "User",
		entityRef: "USR-012",
		entityLink: "/admin/users/USR-012",
		summary: "User suspended pending authorisation renewal — Grace Liu",
		before: { status: "Active" },
		after: { status: "Suspended" },
		sourceIp: "203.42.118.4",
		outcome: "Success"
	}
];
//#endregion
//#region src/data/dashboard.ts
var availabilityTrend = [
	{
		date: "2026-07-09",
		label: "Thu",
		available: 9,
		maintenance: 1,
		aog: 0
	},
	{
		date: "2026-07-10",
		label: "Fri",
		available: 9,
		maintenance: 1,
		aog: 0
	},
	{
		date: "2026-07-11",
		label: "Sat",
		available: 8,
		maintenance: 2,
		aog: 0
	},
	{
		date: "2026-07-12",
		label: "Sun",
		available: 8,
		maintenance: 2,
		aog: 0
	},
	{
		date: "2026-07-13",
		label: "Mon",
		available: 8,
		maintenance: 2,
		aog: 0
	},
	{
		date: "2026-07-14",
		label: "Tue",
		available: 7,
		maintenance: 3,
		aog: 0
	},
	{
		date: "2026-07-15",
		label: "Wed",
		available: 5,
		maintenance: 4,
		aog: 1
	}
];
var notifications = [
	{
		id: "N-1",
		tone: "red",
		kind: "aog",
		strong: "VH-RXT AOG at MQL",
		text: "No.2 hydraulic pump failure — recovery pump in transit, install 16 Jul 08:00.",
		at: "2026-07-15T08:15",
		to: "/work-orders/WO-2026-0033"
	},
	{
		id: "N-2",
		tone: "orange",
		kind: "signoff",
		strong: "WO-2026-0035 ready for sign-off",
		text: "VH-TRW landing light — certification required by 17:30 for ASR-241.",
		at: "2026-07-15T10:35",
		to: "/work-orders/WO-2026-0035/sign-off"
	},
	{
		id: "N-3",
		tone: "blue",
		kind: "defect",
		strong: "New defect DEF-2026-0048",
		text: "VH-BHV navigation database expired — charter ASR-291 tonight.",
		at: "2026-07-15T11:32",
		to: "/defects/DEF-2026-0048"
	},
	{
		id: "N-4",
		tone: "orange",
		kind: "parts",
		strong: "Backorder update — PR-2026-0058",
		text: "Radar R/T unit for VH-LWK: supplier ETA revised to 18 Jul.",
		at: "2026-07-13T10:20",
		to: "/inventory/requests"
	},
	{
		id: "N-5",
		tone: "green",
		kind: "plan",
		strong: "FP-2026-0715 revised (rev 4)",
		text: "ASR-226 cancelled, ASR-258 unassigned — planner review complete.",
		at: "2026-07-15T08:30",
		to: "/fleet/plans/FP-2026-0715"
	}
];
//#endregion
//#region src/data/index.ts
/**
* Central mock-data access layer.
*
* Pages import entities and lookups from here only — no component
* hard-codes operational values. All lookups are simple in-memory
* scans over the static dataset (10 aircraft / 21 flights / 12
* defects / 16 work orders / 13 users / 10 profiles / 8 sign-offs /
* 20 parts / 4 accounts / 22 audit entries / 4 plans / 9 events).
*/
var OPERATOR_NAME = "AeroSync Regional Operations";
var getAircraft = (id) => aircraft.find((a) => a.id.toUpperCase() === id.toUpperCase());
var getFlight = (id) => flights.find((f) => f.id.toUpperCase() === id.toUpperCase());
var getDefect = (id) => defects.find((d) => d.id.toUpperCase() === id.toUpperCase());
var getWorkOrder = (id) => workOrders.find((w) => w.id.toUpperCase() === id.toUpperCase());
var getSignOff = (id) => signOffs.find((s) => s.id.toUpperCase() === id.toUpperCase());
var getUser = (id) => users.find((u) => u.id.toUpperCase() === id.toUpperCase());
var getProfile = (id) => securityProfiles.find((p) => p.id.toUpperCase() === id.toUpperCase());
var getAccount = (id) => accounts.find((a) => a.id.toUpperCase() === id.toUpperCase());
var getFleetPlan = (id) => fleetPlans.find((p) => p.id.toUpperCase() === id.toUpperCase());
var getPart = (id) => parts$1.find((p) => p.id.toUpperCase() === id.toUpperCase());
var currentUser = users.find((u) => u.id === CURRENT_USER_ID);
var userName = (id) => id && getUser(id)?.name || "System";
/** "Jack Munro" → "J. Munro" for dense table cells. */
var shortName = (id) => {
	const n = id && getUser(id)?.name;
	if (!n) return "System";
	const bits = n.split(" ");
	return bits.length > 1 ? `${bits[0][0]}. ${bits.slice(1).join(" ")}` : n;
};
var defectsForAircraft = (aircraftId) => defects.filter((d) => d.aircraftId === aircraftId);
var openDefectsForAircraft = (aircraftId) => defectsForAircraft(aircraftId).filter((d) => d.status !== "Closed" && d.status !== "Cancelled");
var workOrdersForAircraft = (aircraftId) => workOrders.filter((w) => w.aircraftId === aircraftId);
var openWorkOrdersForAircraft = (aircraftId) => workOrdersForAircraft(aircraftId).filter((w) => w.status !== "Closed" && w.status !== "Cancelled");
var flightsForAircraft = (aircraftId) => flights.filter((f) => f.aircraftId === aircraftId);
var recordsForAircraft = (aircraftId) => maintenanceRecords.filter((r) => r.aircraftId === aircraftId);
var signOffsForAircraft = (aircraftId) => signOffs.filter((s) => s.aircraftId === aircraftId);
var requestsForWorkOrder = (workOrderId) => partRequests.filter((r) => r.workOrderId === workOrderId);
var openDefectCount = (aircraftId) => openDefectsForAircraft(aircraftId).length;
var openWorkOrderCount = (aircraftId) => openWorkOrdersForAircraft(aircraftId).length;
var myWorkOrders = () => workOrders.filter((w) => w.assignedToUserId === "USR-014" || w.teamUserIds.includes("USR-014") || w.inspection.inspectorUserId === "USR-014");
var OPEN_WO_STATUSES = [
	"Open",
	"Assigned",
	"In Progress",
	"Awaiting Parts",
	"Awaiting Inspection",
	"Ready for Sign-off"
];
var openWorkOrders = workOrders.filter((w) => OPEN_WO_STATUSES.includes(w.status));
var reviewQueueDefects = defects.filter((d) => d.status === "Reported" || d.status === "Under Review").sort((a, b) => {
	const sev = {
		Critical: 0,
		Significant: 1,
		Minor: 2
	};
	return sev[a.severity] - sev[b.severity] || a.reportedAt.localeCompare(b.reportedAt);
});
var fleetSummary = {
	total: aircraft.length,
	available: aircraft.filter((a) => a.availability === "Available").length,
	assigned: aircraft.filter((a) => a.availability === "Assigned").length,
	aog: aircraft.filter((a) => a.availability === "AOG").length,
	underMaintenance: aircraft.filter((a) => a.availability === "Under Maintenance").length,
	awaitingSignOff: aircraft.filter((a) => a.availability === "Awaiting Sign-off").length,
	awaitingParts: aircraft.filter((a) => a.availability === "Awaiting Parts").length,
	restricted: aircraft.filter((a) => a.availability === "Restricted").length
};
var atRiskFlights = flights.filter((f) => (f.risk === "At Risk" || f.risk === "No Go") && f.status !== "Completed");
var todaysFlights = flights.filter((f) => f.date === "2026-07-15");
var openDefects = defects.filter((d) => d.status !== "Closed" && d.status !== "Cancelled");
var defectSeverityBreakdown = {
	critical: openDefects.filter((d) => d.severity === "Critical").length,
	significant: openDefects.filter((d) => d.severity === "Significant").length,
	minor: openDefects.filter((d) => d.severity === "Minor").length
};
var upcomingMaintenance = maintenanceEvents.filter((e) => e.status !== "Completed").sort((a, b) => a.plannedStart.localeCompare(b.plannedStart));
//#endregion
//#region src/app/navigation.ts
/**
* Grouped sidebar navigation. Permission filtering is intentionally
* not applied in the design preview — every module is reachable.
*/
var navGroups = [
	{
		label: "Overview",
		items: [{
			label: "Dashboard",
			to: paths.dashboard,
			icon: LayoutDashboard
		}]
	},
	{
		label: "Operations",
		items: [
			{
				label: "Fleet Availability",
				to: paths.fleetAvailability,
				icon: PlaneTakeoff
			},
			{
				label: "Fleet Plans",
				to: paths.fleetPlans,
				icon: CalendarRange
			},
			{
				label: "Flights",
				to: paths.flights,
				icon: Route$1
			},
			{
				label: "Defects",
				to: paths.defects,
				icon: TriangleAlert,
				match: [paths.defectReview],
				count: reviewQueueDefects.length,
				countTone: "red"
			},
			{
				label: "Work Orders",
				to: paths.workOrders,
				icon: Wrench,
				count: openWorkOrders.length
			},
			{
				label: "My Assignments",
				to: paths.myWorkOrders,
				icon: ClipboardCheck,
				count: myWorkOrders().length
			}
		]
	},
	{
		label: "Maintenance",
		items: [
			{
				label: "Aircraft Registry",
				to: paths.aircraftList,
				icon: Plane
			},
			{
				label: "Planned Maintenance",
				to: paths.plannedMaintenance,
				icon: CalendarClock
			},
			{
				label: "Sign-offs",
				to: paths.signOffs,
				icon: FileCheck2
			},
			{
				label: "Maintenance Records",
				to: paths.maintenanceRecords,
				icon: Archive
			}
		]
	},
	{
		label: "Supply & Commercial",
		items: [
			{
				label: "Parts Catalogue",
				to: paths.inventoryParts,
				icon: Package
			},
			{
				label: "Stock Levels",
				to: paths.inventoryStock,
				icon: Boxes
			},
			{
				label: "Inventory Transactions",
				to: paths.inventoryTransactions,
				icon: ArrowLeftRight
			},
			{
				label: "Part Requests",
				to: paths.inventoryRequests,
				icon: Inbox
			},
			{
				label: "Accounts",
				to: paths.accounts,
				icon: Building2
			},
			{
				label: "Reports",
				to: paths.reports,
				icon: BarChart3
			}
		]
	},
	{
		label: "Administration",
		items: [
			{
				label: "Users",
				to: paths.adminUsers,
				icon: Users
			},
			{
				label: "Security Profiles",
				to: paths.adminProfiles,
				icon: ShieldCheck
			},
			{
				label: "Audit Logs",
				to: paths.adminAuditLogs,
				icon: ScrollText
			},
			{
				label: "Settings",
				to: paths.adminSettings,
				icon: Settings
			}
		]
	}
];
/** True when the nav item should render as the active route. */
function isNavActive(item, pathname) {
	if (item.to === "/") return pathname === "/";
	const targets = [item.to, ...item.match ?? []];
	if (pathname === item.to) return true;
	return targets.some((t) => {
		if (t !== "/" && pathname.startsWith(`${t}/`)) {
			if (t === paths.workOrders && pathname.startsWith(paths.myWorkOrders)) return false;
			return true;
		}
		return pathname === t;
	});
}
//#endregion
//#region src/components/shell/BrandMark.tsx
/** AeroSync MRO brand mark — stylised ascending delta on radar ring. */
function BrandMark({ size = 32 }) {
	return /* @__PURE__ */ jsx("span", {
		className: "brand-mark",
		style: {
			width: size,
			height: size
		},
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsxs("svg", {
			width: size * .6,
			height: size * .6,
			viewBox: "0 0 24 24",
			fill: "none",
			children: [/* @__PURE__ */ jsx("circle", {
				cx: "12",
				cy: "12",
				r: "10",
				stroke: "rgba(255,255,255,0.35)",
				strokeWidth: "1.4",
				strokeDasharray: "3 2.6"
			}), /* @__PURE__ */ jsx("path", {
				d: "M12 4.6 L18.4 17.8 L12 14.6 L5.6 17.8 Z",
				fill: "#fff"
			})]
		})
	});
}
function BrandBlock() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(BrandMark, {}), /* @__PURE__ */ jsxs("span", {
		className: "brand-text",
		children: [/* @__PURE__ */ jsx("strong", { children: "AeroSync" }), /* @__PURE__ */ jsx("span", { children: "MRO" })]
	})] });
}
//#endregion
//#region src/components/shell/Sidebar.tsx
function Sidebar({ collapsed, onToggleCollapsed, onNavigate }) {
	const { pathname } = useLocation();
	return /* @__PURE__ */ jsxs("nav", {
		id: "app-sidebar",
		className: "app-sidebar",
		"aria-label": "Primary navigation",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "nav-head",
				children: /* @__PURE__ */ jsx(Link, {
					to: paths.dashboard,
					onClick: onNavigate,
					"aria-label": "AeroSync MRO — dashboard",
					style: {
						display: "flex",
						alignItems: "center",
						gap: 10,
						textDecoration: "none"
					},
					children: /* @__PURE__ */ jsx(BrandBlock, {})
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "nav-scroll",
				children: navGroups.map((group) => /* @__PURE__ */ jsxs("div", {
					className: "nav-group",
					children: [/* @__PURE__ */ jsx("span", {
						className: "nav-group-label",
						"aria-hidden": collapsed,
						children: group.label
					}), /* @__PURE__ */ jsx("ul", { children: group.items.map((item) => {
						const active = isNavActive(item, pathname);
						const Icon = item.icon;
						return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
							to: item.to,
							className: "nav-item",
							"aria-current": active ? "page" : void 0,
							title: collapsed ? item.label : void 0,
							"aria-label": item.label,
							onClick: onNavigate,
							children: [
								/* @__PURE__ */ jsx(Icon, {
									size: 17,
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "nav-label",
									children: item.label
								}),
								typeof item.count === "number" && item.count > 0 && /* @__PURE__ */ jsx("span", {
									className: "nav-count",
									"data-tone": item.countTone === "red" ? "red" : void 0,
									"aria-label": `${item.count} items`,
									children: item.count
								})
							]
						}) }, item.to);
					}) })]
				}, group.label))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "nav-foot",
				children: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "nav-collapse-btn",
					onClick: onToggleCollapsed,
					"aria-pressed": collapsed,
					title: collapsed ? "Expand sidebar" : "Collapse sidebar",
					children: [collapsed ? /* @__PURE__ */ jsx(PanelLeftOpen, {
						size: 17,
						"aria-hidden": "true"
					}) : /* @__PURE__ */ jsx(PanelLeftClose, {
						size: 17,
						"aria-hidden": "true"
					}), /* @__PURE__ */ jsx("span", {
						className: "nav-label",
						children: collapsed ? "Expand" : "Collapse"
					})]
				})
			})
		]
	});
}
//#endregion
//#region src/lib/format.ts
/**
* Deterministic date/number formatting for the design preview.
*
* Mock timestamps are stored as local-ops ISO strings
* ("2026-07-15T14:05"). Formatting works directly on the string so
* output is identical in every environment (browser, SSR smoke test)
* and never depends on the viewer's timezone. The preview's "now" is
* pinned to a fixed operational moment.
*/
var NOW = "2026-07-15T13:00";
var MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
var DAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function parts(iso) {
	const [d, t] = iso.split("T");
	const [y, m, day] = d.split("-").map(Number);
	return {
		y,
		m,
		day,
		time: t ? t.slice(0, 5) : ""
	};
}
/** "15 Jul 2026" */
function fmtDate(iso) {
	const { y, m, day } = parts(iso);
	return `${day} ${MONTHS[m - 1]} ${y}`;
}
/** "15 Jul" */
function fmtDayMonth(iso) {
	const { m, day } = parts(iso);
	return `${day} ${MONTHS[m - 1]}`;
}
/** "Wed 15 Jul" */
function fmtWeekday(iso) {
	const { y, m, day } = parts(iso);
	return `${DAYS[new Date(Date.UTC(y, m - 1, day)).getUTCDay()]} ${day} ${MONTHS[m - 1]}`;
}
/** "14:05" */
function fmtTime(iso) {
	return parts(iso).time;
}
/** "15 Jul, 14:05" */
function fmtDateTime(iso) {
	const { m, day, time } = parts(iso);
	return `${day} ${MONTHS[m - 1]}, ${time}`;
}
/** "15 Jul 2026, 14:05" */
function fmtDateTimeFull(iso) {
	const { y, m, day, time } = parts(iso);
	return `${day} ${MONTHS[m - 1]} ${y}, ${time}`;
}
function toMinutes(iso) {
	const { y, m, day, time } = parts(iso);
	const [hh = "0", mm = "0"] = time ? time.split(":") : [];
	return Date.UTC(y, m - 1, day, Number(hh), Number(mm)) / 6e4;
}
/**
* Relative to the pinned preview moment: "2h ago", "35m ago",
* "in 3h", "2d ago". Deterministic across environments.
*/
function fmtRelative(iso, now = NOW) {
	const diff = toMinutes(now) - toMinutes(iso);
	const abs = Math.abs(diff);
	let label;
	if (abs < 60) label = `${Math.max(1, Math.round(abs))}m`;
	else if (abs < 2160) label = `${Math.round(abs / 60)}h`;
	else label = `${Math.round(abs / 1440)}d`;
	return diff >= 0 ? `${label} ago` : `in ${label}`;
}
/** Minutes between two ops timestamps (b - a). */
function minutesBetween(a, b) {
	return Math.round(toMinutes(b) - toMinutes(a));
}
/** "1h 25m" from minutes */
function fmtDuration(mins) {
	const h = Math.floor(Math.abs(mins) / 60);
	const m = Math.abs(mins) % 60;
	if (h === 0) return `${m}m`;
	if (m === 0) return `${h}h`;
	return `${h}h ${m}m`;
}
/** "12,847.6" */
function fmtNumber(n, dp = 0) {
	return n.toLocaleString("en-AU", {
		minimumFractionDigits: dp,
		maximumFractionDigits: dp
	});
}
/** "$14,820" */
function fmtCurrency(n) {
	return `$${fmtNumber(n)}`;
}
/** Initials for avatars: "Daniel Reyes" → "DR" */
function initials(name) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}
/** Stable 1–5 hue bucket for avatar colouring. */
function avatarHue(name) {
	let h = 0;
	for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
	return h % 5 + 1;
}
//#endregion
//#region src/components/ui/Popover.tsx
/**
* Lightweight anchored popover for top-bar menus. Closes on Escape
* and on any pointer press outside the anchor.
*/
function Popover({ open, onClose, trigger, children, label, width }) {
	const ref = useRef(null);
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		const onPress = (e) => {
			if (ref.current && !ref.current.contains(e.target)) onClose();
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onPress);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onPress);
		};
	}, [open, onClose]);
	return /* @__PURE__ */ jsxs("div", {
		className: "popover-anchor",
		ref,
		children: [trigger, open && /* @__PURE__ */ jsx("div", {
			className: "popover",
			role: "dialog",
			"aria-label": label,
			style: width ? { width } : void 0,
			children
		})]
	});
}
//#endregion
//#region src/components/shell/TopBar.tsx
var NOTIF_ICONS = {
	aog: TriangleAlert,
	defect: TriangleAlert,
	signoff: FileCheck2,
	parts: Package,
	plan: CalendarRange
};
function TopBar({ onOpenDrawer }) {
	const [notifOpen, setNotifOpen] = useState(false);
	const [userOpen, setUserOpen] = useState(false);
	const profileSummary = currentUser.securityProfileIds.map((id) => getProfile(id)?.name).filter(Boolean).join(" · ");
	return /* @__PURE__ */ jsxs("header", {
		className: "topbar",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "icon-btn topbar-menu-btn",
				onClick: onOpenDrawer,
				"aria-label": "Open navigation menu",
				children: /* @__PURE__ */ jsx(Menu, {
					size: 19,
					"aria-hidden": "true"
				})
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "topbar-operator",
				children: [/* @__PURE__ */ jsx(Building2, {
					size: 16,
					"aria-hidden": "true"
				}), /* @__PURE__ */ jsx("span", {
					className: "operator-name",
					children: OPERATOR_NAME
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "topbar-search",
				role: "search",
				children: [
					/* @__PURE__ */ jsx(Search, {
						size: 15,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "search",
						placeholder: "Search aircraft, defects, work orders…",
						"aria-label": "Global search (visual preview)"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "kbd-hint",
						"aria-hidden": "true",
						children: "⌘K"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "topbar-right",
				children: [/* @__PURE__ */ jsxs(Popover, {
					open: notifOpen,
					onClose: () => setNotifOpen(false),
					label: "Notifications",
					width: 340,
					trigger: /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "icon-btn",
						"aria-label": `Notifications — ${notifications.length} unread`,
						"aria-expanded": notifOpen,
						onClick: () => setNotifOpen((v) => !v),
						children: [/* @__PURE__ */ jsx(Bell, {
							size: 18,
							"aria-hidden": "true"
						}), /* @__PURE__ */ jsx("span", {
							className: "notif-dot",
							"aria-hidden": "true"
						})]
					}),
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "popover-head",
							children: ["Notifications", /* @__PURE__ */ jsxs("span", {
								className: "chip",
								children: [notifications.length, " unread"]
							})]
						}),
						/* @__PURE__ */ jsx("div", { children: notifications.map((n) => {
							const Icon = NOTIF_ICONS[n.kind];
							return /* @__PURE__ */ jsxs("div", {
								className: "notif-item",
								children: [/* @__PURE__ */ jsx("span", {
									className: "notif-icon",
									"data-tone": n.tone,
									children: /* @__PURE__ */ jsx(Icon, {
										size: 14,
										"aria-hidden": "true"
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "notif-text",
									children: [/* @__PURE__ */ jsxs("p", { children: [
										/* @__PURE__ */ jsx("strong", { children: n.strong }),
										" — ",
										n.text
									] }), /* @__PURE__ */ jsxs("div", {
										className: "notif-time",
										children: [
											fmtRelative(n.at),
											" ·",
											" ",
											/* @__PURE__ */ jsx(Link, {
												to: n.to,
												onClick: () => setNotifOpen(false),
												children: "Open"
											})
										]
									})]
								})]
							}, n.id);
						}) }),
						/* @__PURE__ */ jsx("div", {
							className: "popover-foot muted",
							children: "Notification delivery is a visual preview only"
						})
					]
				}), /* @__PURE__ */ jsxs(Popover, {
					open: userOpen,
					onClose: () => setUserOpen(false),
					label: "User menu",
					width: 280,
					trigger: /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "topbar-user-btn",
						"aria-expanded": userOpen,
						"aria-label": `User menu — ${currentUser.name}`,
						onClick: () => setUserOpen((v) => !v),
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "avatar",
								"data-hue": avatarHue(currentUser.name),
								"aria-hidden": "true",
								children: initials(currentUser.name)
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "topbar-user-meta",
								children: [/* @__PURE__ */ jsx("strong", { children: currentUser.name }), /* @__PURE__ */ jsxs("span", { children: [currentUser.role, " · LE Release"] })]
							}),
							/* @__PURE__ */ jsx(ChevronDown, {
								size: 14,
								"aria-hidden": "true",
								className: "hide-mobile"
							})
						]
					}),
					children: [/* @__PURE__ */ jsxs("div", {
						className: "popover-head",
						style: { display: "block" },
						children: [
							/* @__PURE__ */ jsx("div", { children: currentUser.name }),
							/* @__PURE__ */ jsx("div", {
								className: "muted",
								style: {
									fontWeight: 400,
									marginTop: 2
								},
								children: currentUser.email
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "muted",
								style: {
									fontWeight: 400,
									marginTop: 6,
									fontSize: "var(--fs-xs)"
								},
								children: [
									currentUser.role,
									" · ",
									profileSummary
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "menu-list",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								className: "menu-item",
								to: paths.adminUser(currentUser.id),
								onClick: () => setUserOpen(false),
								children: [/* @__PURE__ */ jsx(CircleUserRound, {
									size: 16,
									"aria-hidden": "true"
								}), "My profile"]
							}),
							/* @__PURE__ */ jsxs(Link, {
								className: "menu-item",
								to: paths.myWorkOrders,
								onClick: () => setUserOpen(false),
								children: [/* @__PURE__ */ jsx(ClipboardCheck, {
									size: 16,
									"aria-hidden": "true"
								}), "My assignments"]
							}),
							/* @__PURE__ */ jsxs(Link, {
								className: "menu-item",
								to: paths.aircraftList,
								onClick: () => setUserOpen(false),
								children: [/* @__PURE__ */ jsx(Plane, {
									size: 16,
									"aria-hidden": "true"
								}), "Aircraft lookup"]
							}),
							/* @__PURE__ */ jsxs(Link, {
								className: "menu-item",
								to: paths.adminSettings,
								onClick: () => setUserOpen(false),
								children: [/* @__PURE__ */ jsx(Settings, {
									size: 16,
									"aria-hidden": "true"
								}), "Settings"]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "menu-sep",
								role: "separator"
							}),
							/* @__PURE__ */ jsxs(Link, {
								className: "menu-item menu-item--danger",
								to: paths.login,
								onClick: () => setUserOpen(false),
								children: [/* @__PURE__ */ jsx(LogOut, {
									size: 16,
									"aria-hidden": "true"
								}), "Sign out"]
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/shell/AppShell.tsx
/**
* Global application shell: collapsible sidebar (drawer below 768px),
* sticky top bar, content region and the persistent prototype
* disclaimer footer.
*/
function AppShell() {
	const [collapsed, setCollapsed] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { pathname } = useLocation();
	useEffect(() => {
		setDrawerOpen(false);
		window.scrollTo({ top: 0 });
	}, [pathname]);
	useEffect(() => {
		if (!drawerOpen) return;
		const onKey = (e) => {
			if (e.key === "Escape") setDrawerOpen(false);
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [drawerOpen]);
	const closeDrawer = useCallback(() => setDrawerOpen(false), []);
	return /* @__PURE__ */ jsxs("div", {
		className: "app-shell",
		"data-sidebar": collapsed ? "collapsed" : "expanded",
		"data-drawer": drawerOpen ? "open" : "closed",
		children: [
			/* @__PURE__ */ jsx("a", {
				className: "skip-link",
				href: "#main-content",
				children: "Skip to main content"
			}),
			/* @__PURE__ */ jsx(Sidebar, {
				collapsed,
				onToggleCollapsed: () => setCollapsed((v) => !v),
				onNavigate: closeDrawer
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "nav-scrim",
				"aria-label": "Close navigation menu",
				tabIndex: drawerOpen ? 0 : -1,
				onClick: closeDrawer
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "app-main",
				children: [
					/* @__PURE__ */ jsx(TopBar, { onOpenDrawer: () => setDrawerOpen(true) }),
					/* @__PURE__ */ jsx("main", {
						id: "main-content",
						className: "app-content",
						tabIndex: -1,
						children: /* @__PURE__ */ jsx(Outlet, {})
					}),
					/* @__PURE__ */ jsxs("footer", {
						className: "prototype-footer",
						children: [
							/* @__PURE__ */ jsx(TriangleAlert, {
								size: 14,
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Prototype" }), " — not for operational use or airworthiness decisions."] }),
							/* @__PURE__ */ jsx("span", {
								className: "foot-meta",
								children: "AeroSync MRO · Design preview build · Ops time pinned to 15 Jul 2026, 13:00"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/lib/status.ts
var TONE_BY_STATUS = {
	"Available": "green",
	"Assigned": "amber",
	"Restricted": "amber",
	"Under Maintenance": "blue",
	"AOG": "red",
	"Planned Maintenance": "blue",
	"Awaiting Parts": "orange",
	"Awaiting Inspection": "orange",
	"Awaiting Sign-off": "orange",
	"Serviceable": "green",
	"Unserviceable": "red",
	"Reported": "blue",
	"Under Review": "blue",
	"Deferred": "amber",
	"Work Order Created": "blue",
	"Rectified": "green",
	"Closed": "green",
	"Cancelled": "grey",
	"Open": "blue",
	"In Progress": "blue",
	"Ready for Sign-off": "orange",
	"Clear": "green",
	"Monitor": "amber",
	"At Risk": "orange",
	"No Go": "red",
	"Minor": "blue",
	"Significant": "orange",
	"Critical": "red",
	"Routine": "grey",
	"Urgent": "orange",
	"Scheduled": "blue",
	"Boarding": "blue",
	"Departed": "green",
	"Completed": "green",
	"Delayed": "orange",
	"Draft": "grey",
	"Published": "green",
	"Archived": "grey",
	"Active": "green",
	"Suspended": "red",
	"Invited": "blue",
	"In Stock": "green",
	"Low Stock": "orange",
	"Out of Stock": "red",
	"Quarantine": "amber",
	"Backordered": "orange",
	"Approved": "blue",
	"Picked": "amber",
	"Issued": "green",
	"In Transit": "amber",
	"Issue": "blue",
	"Return": "green",
	"Transfer": "amber",
	"Adjustment": "grey",
	"Receipt": "green",
	"Current": "green",
	"Invoiced": "blue",
	"Overdue": "red",
	"Inactive": "grey",
	"Internal": "grey",
	"Released": "green",
	"Released with Limitations": "amber",
	"Verified": "green",
	"Complete": "green",
	"Pending Review": "orange",
	"Pending": "orange",
	"Passed": "green",
	"Not Required": "grey",
	"Success": "green",
	"Denied": "red",
	"Failed": "red",
	"On Track": "green",
	"Confirmed": "green",
	"Tentative": "grey",
	"Informational": "blue"
};
/** Resolve the UI tone for any documented status label. */
function toneFor(status) {
	return TONE_BY_STATUS[status] ?? "grey";
}
//#endregion
//#region src/components/ui/Badge.tsx
function Badge({ tone, children, icon, title }) {
	return /* @__PURE__ */ jsxs("span", {
		className: `badge badge--${tone}`,
		title,
		children: [icon ?? /* @__PURE__ */ jsx("span", {
			className: "badge-dot",
			"aria-hidden": "true"
		}), children]
	});
}
/** Any documented workflow status → tone-mapped badge with label. */
function StatusBadge({ status, title }) {
	return /* @__PURE__ */ jsx(Badge, {
		tone: toneFor(status),
		title,
		children: status
	});
}
/** Defect severity with a shape icon (not colour-only). */
function SeverityBadge({ severity }) {
	return /* @__PURE__ */ jsx(Badge, {
		tone: toneFor(severity),
		icon: severity === "Critical" ? /* @__PURE__ */ jsx(OctagonAlert, {
			size: 12,
			"aria-hidden": "true"
		}) : severity === "Significant" ? /* @__PURE__ */ jsx(TriangleAlert, {
			size: 12,
			"aria-hidden": "true"
		}) : /* @__PURE__ */ jsx(Info, {
			size: 12,
			"aria-hidden": "true"
		}),
		children: severity
	});
}
/** Flight / aircraft maintenance risk with icon reinforcement. */
function RiskBadge({ risk }) {
	return /* @__PURE__ */ jsx(Badge, {
		tone: toneFor(risk),
		icon: risk === "No Go" ? /* @__PURE__ */ jsx(OctagonAlert, {
			size: 12,
			"aria-hidden": "true"
		}) : risk === "At Risk" ? /* @__PURE__ */ jsx(TriangleAlert, {
			size: 12,
			"aria-hidden": "true"
		}) : risk === "Monitor" ? /* @__PURE__ */ jsx(CircleAlert, {
			size: 12,
			"aria-hidden": "true"
		}) : /* @__PURE__ */ jsx(CircleCheck, {
			size: 12,
			"aria-hidden": "true"
		}),
		children: risk
	});
}
/** Work-order priority (AOG rendered as a solid red badge). */
function PriorityBadge({ priority }) {
	if (priority === "AOG") return /* @__PURE__ */ jsxs("span", {
		className: "badge badge--solid-red",
		children: [/* @__PURE__ */ jsx(OctagonAlert, {
			size: 12,
			"aria-hidden": "true"
		}), "AOG"]
	});
	return /* @__PURE__ */ jsx(StatusBadge, { status: priority });
}
/** Status badge + supporting reason text for dense table cells. */
function StatusCell({ status, reason }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "status-cell",
		children: [/* @__PURE__ */ jsx(StatusBadge, { status }), reason && /* @__PURE__ */ jsx("span", {
			className: "status-reason",
			title: reason,
			children: reason
		})]
	});
}
//#endregion
//#region src/components/ui/Form.tsx
/**
* Visual-only form primitives. Inputs use defaultValue and never
* submit — buttons either navigate to another preview route or do
* nothing beyond local state.
*/
function FormCard({ children }) {
	return /* @__PURE__ */ jsx("section", {
		className: "card",
		children
	});
}
function FormSection({ title, hint, children }) {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("div", {
		className: "form-section-head",
		children: [/* @__PURE__ */ jsx("h2", { children: title }), hint && /* @__PURE__ */ jsx("p", { children: hint })]
	}), /* @__PURE__ */ jsx("div", {
		className: "form-grid",
		children
	})] });
}
function FieldShell({ label, htmlFor, required, hint, error, full, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `field${full ? " field--full" : ""}${error ? " field--error" : ""}`,
		children: [
			/* @__PURE__ */ jsxs("label", {
				htmlFor,
				children: [label, required && /* @__PURE__ */ jsx("span", {
					className: "req",
					"aria-hidden": "true",
					children: "*"
				})]
			}),
			children,
			error ? /* @__PURE__ */ jsxs("span", {
				className: "field-error",
				children: [/* @__PURE__ */ jsx(CircleAlert, {
					size: 13,
					"aria-hidden": "true"
				}), error]
			}) : hint && /* @__PURE__ */ jsx("span", {
				className: "field-hint",
				children: hint
			})
		]
	});
}
function TextField({ id, label, defaultValue, placeholder, required, hint, error, full, type }) {
	return /* @__PURE__ */ jsx(FieldShell, {
		label,
		htmlFor: id,
		required,
		hint,
		error,
		full,
		children: /* @__PURE__ */ jsx("input", {
			id,
			className: "input",
			type: type ?? "text",
			defaultValue,
			placeholder
		})
	});
}
function SelectField({ id, label, options, defaultValue, required, hint, full, placeholder }) {
	return /* @__PURE__ */ jsx(FieldShell, {
		label,
		htmlFor: id,
		required,
		hint,
		full,
		children: /* @__PURE__ */ jsxs("select", {
			id,
			defaultValue: defaultValue ?? (placeholder ? "" : void 0),
			children: [placeholder && /* @__PURE__ */ jsx("option", {
				value: "",
				disabled: true,
				children: placeholder
			}), options.map((o) => /* @__PURE__ */ jsx("option", {
				value: o,
				children: o
			}, o))]
		})
	});
}
function TextAreaField({ id, label, defaultValue, placeholder, required, hint, full, rows }) {
	return /* @__PURE__ */ jsx(FieldShell, {
		label,
		htmlFor: id,
		required,
		hint,
		full,
		children: /* @__PURE__ */ jsx("textarea", {
			id,
			defaultValue,
			placeholder,
			rows: rows ?? 4
		})
	});
}
function CheckRow({ id, label, defaultChecked, type }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "check-row",
		children: [/* @__PURE__ */ jsx("input", {
			id,
			type: type ?? "checkbox",
			defaultChecked
		}), /* @__PURE__ */ jsx("label", {
			htmlFor: id,
			children: label
		})]
	});
}
function FormFooter({ note, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "form-footer",
		children: [note && /* @__PURE__ */ jsx("span", {
			className: "form-footer-note",
			children: note
		}), children]
	});
}
/** Visual photo/document dropzone (uploads are not implemented). */
function AttachmentDropzone({ hint }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "dropzone",
		children: [
			/* @__PURE__ */ jsx(ImageUp, {
				size: 22,
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ jsxs("span", { children: ["Drag photos here or ", /* @__PURE__ */ jsx("strong", { children: "browse files" })] }),
			/* @__PURE__ */ jsx("span", {
				style: { fontSize: "var(--fs-sm)" },
				children: hint ?? "JPEG or PDF up to 10 MB — visual preview only, files are not uploaded"
			})
		]
	});
}
//#endregion
//#region src/components/ui/Misc.tsx
/** Progress bar with textual percentage (never colour-only). */
function ProgressBar({ value, tone, label }) {
	const pct = Math.round(value);
	return /* @__PURE__ */ jsxs("span", {
		className: "progress",
		"data-tone": tone,
		role: "img",
		"aria-label": label ?? `${pct}% complete`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "progress-track",
			children: /* @__PURE__ */ jsx("span", {
				className: "progress-fill",
				style: { width: `${Math.min(100, Math.max(0, pct))}%` }
			})
		}), /* @__PURE__ */ jsxs("span", {
			className: "progress-label",
			children: [pct, "%"]
		})]
	});
}
/** Empty state for filtered-out or genuinely empty mock views. */
function EmptyState({ icon: Icon, title, children, action }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "empty-state",
		children: [
			/* @__PURE__ */ jsx(Icon, {
				size: 28,
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ jsx("h3", { children: title }),
			children && /* @__PURE__ */ jsx("p", { children }),
			action
		]
	});
}
/** Inline banner (info / warn / danger / neutral). */
function Banner({ tone, children, icon }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `banner banner--${tone}`,
		role: tone === "danger" ? "alert" : void 0,
		children: [icon ?? /* @__PURE__ */ jsx(TriangleAlert, {
			size: 15,
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsx("div", { children })]
	});
}
/** Prototype notice used on auth pages and formal documents. */
function PrototypeNotice({ compact }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `banner banner--warn`,
		style: compact ? {
			padding: "8px 12px",
			fontSize: "var(--fs-sm)"
		} : void 0,
		children: [/* @__PURE__ */ jsx(TriangleAlert, {
			size: 15,
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: "Prototype" }), " — not for operational use or airworthiness decisions."] })]
	});
}
/** Attachment tiles (no real files — visual preview only). */
function AttachmentGrid({ attachments }) {
	if (attachments.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "muted",
		style: { fontSize: "var(--fs-md)" },
		children: "No attachments on this record."
	});
	return /* @__PURE__ */ jsx("div", {
		className: "attachment-grid",
		children: attachments.map((a) => /* @__PURE__ */ jsxs("div", {
			className: "attachment",
			"data-kind": a.kind,
			children: [/* @__PURE__ */ jsx("div", {
				className: "attachment-thumb",
				children: a.kind === "photo" ? /* @__PURE__ */ jsx(Image, {
					size: 22,
					"aria-hidden": "true"
				}) : /* @__PURE__ */ jsx(FileText, {
					size: 22,
					"aria-hidden": "true"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "attachment-meta",
				children: [/* @__PURE__ */ jsx("div", {
					className: "attachment-name",
					title: a.name,
					children: a.name
				}), /* @__PURE__ */ jsxs("div", {
					className: "attachment-sub",
					children: [
						a.kind === "photo" ? "Photo" : "Document",
						" · ",
						a.size,
						" · ",
						userName(a.uploadedByUserId),
						" ·",
						" ",
						fmtDateTime(a.uploadedAt)
					]
				})]
			})]
		}, a.name))
	});
}
/** Visual pagination that pages a local mock view. */
function Pagination({ pages, page, onChange }) {
	return /* @__PURE__ */ jsxs("nav", {
		className: "pagination",
		"aria-label": "Pagination",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => onChange(page - 1),
				disabled: page <= 1,
				"aria-label": "Previous page",
				children: /* @__PURE__ */ jsx(ChevronLeft, {
					size: 14,
					"aria-hidden": "true"
				})
			}),
			Array.from({ length: pages }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-current": p === page ? "page" : void 0,
				onClick: () => onChange(p),
				children: p
			}, p)),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => onChange(page + 1),
				disabled: page >= pages,
				"aria-label": "Next page",
				children: /* @__PURE__ */ jsx(ChevronRight, {
					size: 14,
					"aria-hidden": "true"
				})
			})
		]
	});
}
//#endregion
//#region src/pages/auth/LoginPage.tsx
/**
* Standalone sign-in screen — no application shell. "Sign in" is a
* plain navigation Link to the dashboard, matching the preview's
* always-authenticated convention.
*/
function LoginPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "auth-layout",
		children: [/* @__PURE__ */ jsx("div", {
			className: "auth-form-col",
			children: /* @__PURE__ */ jsxs("div", {
				className: "auth-form-inner",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "auth-brand",
						children: /* @__PURE__ */ jsx(BrandBlock, {})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "auth-title",
						children: [/* @__PURE__ */ jsx("h1", { children: "Sign in to AeroSync MRO" }), /* @__PURE__ */ jsx("p", { children: "Fleet maintenance, planning and release control." })]
					}),
					/* @__PURE__ */ jsxs("form", {
						className: "auth-form",
						onSubmit: (e) => e.preventDefault(),
						"aria-label": "Sign in",
						children: [
							/* @__PURE__ */ jsx(TextField, {
								id: "login-email",
								label: "Email",
								type: "email",
								placeholder: "name@operator.com.au",
								defaultValue: "daniel.reyes@aerosync.example"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "login-password",
								label: "Password",
								type: "password",
								defaultValue: "preview-only"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "auth-links",
								children: [/* @__PURE__ */ jsx(CheckRow, {
									id: "remember",
									label: "Keep me signed in on this device",
									defaultChecked: true
								}), /* @__PURE__ */ jsx(Link, {
									to: paths.forgotPassword,
									children: "Forgot password?"
								})]
							}),
							/* @__PURE__ */ jsx(Link, {
								to: paths.dashboard,
								className: "btn btn--primary btn--lg btn--block",
								children: "Sign in"
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "muted",
						style: { fontSize: "var(--fs-sm)" },
						children: "Access is provisioned by your administrator — accounts use role plus security profiles."
					}),
					/* @__PURE__ */ jsx(PrototypeNotice, { compact: true }),
					/* @__PURE__ */ jsx("div", {
						className: "auth-foot",
						children: "© 2026 AeroSync MRO · Design preview build"
					})
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "auth-visual",
			children: [/* @__PURE__ */ jsx("div", {
				className: "auth-visual-grid",
				"aria-hidden": "true"
			}), /* @__PURE__ */ jsxs("div", {
				className: "auth-visual-content",
				children: [
					/* @__PURE__ */ jsx("h2", { children: "Every tail, every defect, every release — one operational picture." }),
					/* @__PURE__ */ jsx("p", { children: "Fleet planners, maintenance controllers, engineers and licensed engineers share the same live board — from the moment a pilot reports a defect through to the certified release that puts the aircraft back on the schedule." }),
					/* @__PURE__ */ jsxs("div", {
						className: "auth-visual-card",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "avc-row",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "ref",
										children: "VH-OYU"
									}),
									/* @__PURE__ */ jsx("span", { children: "Assigned · ASR-214 MEL→MQL" }),
									/* @__PURE__ */ jsx(StatusBadge, { status: "Assigned" })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "avc-row",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "ref",
										children: "WO-2026-0035"
									}),
									/* @__PURE__ */ jsx("span", { children: "Landing light — awaiting certification" }),
									/* @__PURE__ */ jsx(StatusBadge, { status: "Ready for Sign-off" })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "avc-row",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "ref",
										children: "VH-RXT"
									}),
									/* @__PURE__ */ jsx("span", { children: "Hydraulic pump — recovery in progress" }),
									/* @__PURE__ */ jsx(StatusBadge, { status: "AOG" })
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "auth-visual-stats",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "stat-label",
								children: "Aircraft managed"
							}), /* @__PURE__ */ jsx("div", {
								className: "stat-value",
								children: "10"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "stat-label",
								children: "Releases this quarter"
							}), /* @__PURE__ */ jsx("div", {
								className: "stat-value",
								children: "8"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "stat-label",
								children: "Audited actions today"
							}), /* @__PURE__ */ jsx("div", {
								className: "stat-value",
								children: "22"
							})] })
						]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/pages/auth/ForgotPasswordPage.tsx
/**
* Standalone password-reset request screen. Demonstrates the
* confirmation-state preview: submitting swaps the form for a
* Banner acknowledging the (fictional) reset email.
*/
function ForgotPasswordPage() {
	const [sent, setSent] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "auth-layout",
		children: [/* @__PURE__ */ jsx("div", {
			className: "auth-form-col",
			children: /* @__PURE__ */ jsxs("div", {
				className: "auth-form-inner",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "auth-brand",
						children: /* @__PURE__ */ jsx(BrandBlock, {})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "auth-title",
						children: [/* @__PURE__ */ jsx("h1", { children: "Reset your password" }), /* @__PURE__ */ jsx("p", { children: "Enter the email on your AeroSync MRO account and we will send a link to reset your password." })]
					}),
					!sent ? /* @__PURE__ */ jsxs("form", {
						className: "auth-form",
						onSubmit: (e) => {
							e.preventDefault();
							setSent(true);
						},
						"aria-label": "Reset password",
						children: [/* @__PURE__ */ jsx(TextField, {
							id: "forgot-email",
							label: "Email",
							type: "email",
							placeholder: "name@operator.com.au",
							defaultValue: "daniel.reyes@aerosync.example"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn btn--primary btn--lg btn--block",
							children: "Send reset link"
						})]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "auth-form",
						children: [/* @__PURE__ */ jsx(Banner, {
							tone: "info",
							icon: /* @__PURE__ */ jsx(MailCheck, {
								size: 15,
								"aria-hidden": "true"
							}),
							children: "Reset link sent — check daniel.reyes@aerosync.example. The link expires in 30 minutes."
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn--secondary",
							children: "Send again"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "auth-links",
						children: /* @__PURE__ */ jsx(Link, {
							to: paths.login,
							children: "← Back to sign in"
						})
					}),
					/* @__PURE__ */ jsx(PrototypeNotice, { compact: true }),
					/* @__PURE__ */ jsx("div", {
						className: "auth-foot",
						children: "© 2026 AeroSync MRO · Design preview build"
					})
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "auth-visual",
			children: [/* @__PURE__ */ jsx("div", {
				className: "auth-visual-grid",
				"aria-hidden": "true"
			}), /* @__PURE__ */ jsxs("div", {
				className: "auth-visual-content",
				children: [/* @__PURE__ */ jsx("h2", { children: "Release control needs accountable access." }), /* @__PURE__ */ jsx("p", { children: "Password resets, invitations and session activity are all recorded to the audit trail — every account change is traceable back to an administrator and a timestamp." })]
			})]
		})]
	});
}
//#endregion
//#region src/components/ui/DetailGrid.tsx
/** Key/value grid used on detail pages (definition-list semantics). */
function DetailGrid({ items }) {
	return /* @__PURE__ */ jsx("dl", {
		className: "detail-grid",
		children: items.map((item) => /* @__PURE__ */ jsxs("div", {
			className: "detail-item",
			children: [/* @__PURE__ */ jsx("dt", { children: item.label }), /* @__PURE__ */ jsx("dd", { children: item.value })]
		}, item.label))
	});
}
//#endregion
//#region src/pages/auth/InvitePage.tsx
/**
* Standalone invite-acceptance screen. The token from the route is
* shown for context only — nothing is validated against a backend.
*/
function InvitePage() {
	const { token = "" } = useParams();
	const profile = getProfile("SP-006");
	return /* @__PURE__ */ jsxs("div", {
		className: "auth-layout",
		children: [/* @__PURE__ */ jsx("div", {
			className: "auth-form-col",
			children: /* @__PURE__ */ jsxs("div", {
				className: "auth-form-inner",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "auth-brand",
						children: /* @__PURE__ */ jsx(BrandBlock, {})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "auth-title",
						children: [/* @__PURE__ */ jsx("h1", { children: "Accept your invitation" }), /* @__PURE__ */ jsx("p", { children: "You have been invited to join AeroSync Regional Operations." })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "card",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [/* @__PURE__ */ jsx(DetailGrid, { items: [
								{
									label: "Invited email",
									value: "aisha.khan@aerosync.example"
								},
								{
									label: "Role",
									value: "Pilot"
								},
								{
									label: "Security profiles",
									value: "Pilot - Line Report (SP-006)"
								},
								{
									label: "Invited by",
									value: "Marcus Hale · 12 Jul 2026"
								},
								{
									label: "Account",
									value: "AeroSync Regional Operations (ACC-001)"
								}
							] }), /* @__PURE__ */ jsxs("p", {
								className: "muted ref",
								style: {
									fontSize: "var(--fs-sm)",
									marginTop: 10
								},
								children: ["Invitation token: ", token]
							})]
						})
					}),
					/* @__PURE__ */ jsxs("form", {
						className: "auth-form",
						onSubmit: (e) => e.preventDefault(),
						"aria-label": "Accept invitation",
						children: [
							/* @__PURE__ */ jsx(TextField, {
								id: "invite-name",
								label: "Full name",
								defaultValue: "Aisha Khan"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "invite-password",
								label: "Password",
								type: "password",
								required: true,
								hint: "Minimum 12 characters with a number and symbol"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "invite-password-confirm",
								label: "Confirm password",
								type: "password",
								required: true
							}),
							/* @__PURE__ */ jsx(CheckRow, {
								id: "invite-terms",
								label: "I accept the acceptable-use and data policies (preview)"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: paths.dashboard,
								className: "btn btn--primary btn--lg btn--block",
								children: "Accept invitation & sign in"
							})
						]
					}),
					/* @__PURE__ */ jsx(PrototypeNotice, { compact: true }),
					/* @__PURE__ */ jsx("div", {
						className: "auth-foot",
						children: "© 2026 AeroSync MRO · Design preview build"
					})
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "auth-visual",
			children: [/* @__PURE__ */ jsx("div", {
				className: "auth-visual-grid",
				"aria-hidden": "true"
			}), /* @__PURE__ */ jsxs("div", {
				className: "auth-visual-content",
				children: [
					/* @__PURE__ */ jsx("h2", { children: "Roles describe who you are. Security profiles describe what you can do." }),
					/* @__PURE__ */ jsxs("p", { children: [
						"Every account is assigned one or more security profiles that grant a precise set of permissions — this invitation carries the ",
						/* @__PURE__ */ jsx("span", {
							className: "ref",
							style: { color: "#fff" },
							children: "SP-006"
						}),
						" ",
						"profile, scoped to pilot line reporting."
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "auth-visual-card",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "avc-row",
								style: { alignItems: "flex-start" },
								children: [/* @__PURE__ */ jsx("span", {
									className: "ref",
									children: "defect.create"
								}), /* @__PURE__ */ jsx("span", {
									className: "muted",
									style: { color: "var(--nav-text-dim)" },
									children: "Report new defects from the line"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "avc-row",
								style: { alignItems: "flex-start" },
								children: [/* @__PURE__ */ jsx("span", {
									className: "ref",
									children: "defect.view"
								}), /* @__PURE__ */ jsx("span", {
									className: "muted",
									style: { color: "var(--nav-text-dim)" },
									children: "Track the status of reported defects"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "avc-row",
								style: { alignItems: "flex-start" },
								children: [/* @__PURE__ */ jsx("span", {
									className: "ref",
									children: "aircraft.view"
								}), /* @__PURE__ */ jsx("span", {
									className: "muted",
									style: { color: "var(--nav-text-dim)" },
									children: "Look up registry details for context"
								})]
							})
						]
					}),
					profile && /* @__PURE__ */ jsx("p", {
						className: "muted",
						style: {
							color: "var(--nav-text-dim)",
							fontSize: "var(--fs-sm)"
						},
						children: profile.description
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/components/shell/PageHeader.tsx
function Breadcrumbs({ crumbs }) {
	const all = [{
		label: "Dashboard",
		to: paths.dashboard
	}, ...crumbs];
	return /* @__PURE__ */ jsx("nav", {
		"aria-label": "Breadcrumb",
		className: "breadcrumbs",
		children: all.map((c, i) => {
			const last = i === all.length - 1;
			return /* @__PURE__ */ jsxs("span", {
				style: {
					display: "inline-flex",
					alignItems: "center",
					gap: 4
				},
				children: [i > 0 && /* @__PURE__ */ jsx(ChevronRight, {
					size: 12,
					className: "crumb-sep",
					"aria-hidden": "true"
				}), last || !c.to ? /* @__PURE__ */ jsx("span", {
					"aria-current": last ? "page" : void 0,
					children: c.label
				}) : /* @__PURE__ */ jsx(Link, {
					to: c.to,
					children: c.label
				})]
			}, `${c.label}-${i}`);
		})
	});
}
/** Standard content header: breadcrumbs, title, description, actions. */
function PageHeader({ crumbs, title, description, actions, meta }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "page-header",
		children: [crumbs && /* @__PURE__ */ jsx(Breadcrumbs, { crumbs }), /* @__PURE__ */ jsxs("div", {
			className: "page-header-row",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("h1", { children: title }),
				description && /* @__PURE__ */ jsx("p", {
					className: "page-desc",
					children: description
				}),
				meta && /* @__PURE__ */ jsx("div", {
					className: "entity-meta-row",
					children: meta
				})
			] }), actions && /* @__PURE__ */ jsx("div", {
				className: "page-actions",
				children: actions
			})]
		})]
	});
}
//#endregion
//#region src/components/ui/MetricCard.tsx
/** Compact KPI card; renders as a link when `to` is provided. */
function MetricCard({ label, value, meta, tone, icon: Icon, to }) {
	const body = /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsxs("span", {
			className: "metric-label",
			children: [Icon && /* @__PURE__ */ jsx(Icon, {
				size: 13,
				"aria-hidden": "true"
			}), label]
		}),
		/* @__PURE__ */ jsx("span", {
			className: "metric-value",
			children: value
		}),
		meta && /* @__PURE__ */ jsx("span", {
			className: "metric-meta",
			children: meta
		})
	] });
	if (to) return /* @__PURE__ */ jsx(Link, {
		to,
		className: "metric-card",
		"data-tone": tone,
		children: body
	});
	return /* @__PURE__ */ jsx("div", {
		className: "metric-card",
		"data-tone": tone,
		children: body
	});
}
//#endregion
//#region src/components/ui/Charts.tsx
/**
* Small dependency-free SVG charts for dashboards and reports.
* Every chart pairs colour with a text legend, and exposes an
* accessible label.
*/
var TONE_COLORS = {
	green: "var(--tone-green-dot)",
	amber: "var(--tone-amber-dot)",
	orange: "var(--tone-orange-dot)",
	red: "var(--tone-red-dot)",
	grey: "var(--tone-grey-dot)",
	blue: "var(--tone-blue-dot)",
	accent: "var(--accent)"
};
/** Stacked columns (e.g. 7-day availability). */
function StackedBarChart({ labels, series, height = 120, ariaLabel }) {
	const n = labels.length;
	const totals = labels.map((_, i) => series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
	const max = Math.max(...totals, 1);
	const gap = 8;
	const w = 100 / n;
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("svg", {
			viewBox: `0 0 100 ${height}`,
			preserveAspectRatio: "none",
			style: {
				width: "100%",
				height
			},
			role: "img",
			"aria-label": ariaLabel,
			children: labels.map((_, i) => {
				let y = height;
				return /* @__PURE__ */ jsx("g", { children: series.map((s) => {
					const h = (s.values[i] ?? 0) / max * (height - 6);
					y -= h;
					return /* @__PURE__ */ jsx("rect", {
						x: i * w + gap / 2,
						y,
						width: w - gap,
						height: Math.max(h - 1.5, 0),
						rx: 1.5,
						fill: TONE_COLORS[s.tone]
					}, s.label);
				}) }, `col-${i}`);
			})
		}),
		/* @__PURE__ */ jsx("div", {
			className: "bar-chart-labels",
			"aria-hidden": "true",
			children: labels.map((l) => /* @__PURE__ */ jsx("span", { children: l }, l))
		}),
		/* @__PURE__ */ jsx("div", {
			className: "chart-legend",
			style: { marginTop: 6 },
			children: series.map((s) => /* @__PURE__ */ jsxs("span", {
				className: "legend-item",
				children: [/* @__PURE__ */ jsx("span", {
					className: "legend-swatch",
					style: { background: TONE_COLORS[s.tone] },
					"aria-hidden": "true"
				}), s.label]
			}, s.label))
		})
	] });
}
/** Donut breakdown (e.g. open defects by severity). */
function DonutChart({ segments, centreLabel, centreValue, size = 132, ariaLabel }) {
	const total = Math.max(segments.reduce((s, seg) => s + seg.value, 0), 1);
	const r = 15.915;
	let offset = 25;
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			alignItems: "center",
			gap: 18,
			flexWrap: "wrap"
		},
		children: [/* @__PURE__ */ jsxs("svg", {
			width: size,
			height: size,
			viewBox: "0 0 42 42",
			role: "img",
			"aria-label": ariaLabel,
			children: [
				/* @__PURE__ */ jsx("circle", {
					cx: "21",
					cy: "21",
					r,
					fill: "none",
					stroke: "var(--tone-grey-bg)",
					strokeWidth: "5"
				}),
				segments.map((seg) => {
					const frac = seg.value / total * 100;
					const el = /* @__PURE__ */ jsx("circle", {
						cx: "21",
						cy: "21",
						r,
						fill: "none",
						stroke: TONE_COLORS[seg.tone],
						strokeWidth: "5",
						strokeDasharray: `${frac} ${100 - frac}`,
						strokeDashoffset: offset,
						strokeLinecap: "butt"
					}, seg.label);
					offset -= frac;
					return el;
				}),
				/* @__PURE__ */ jsx("text", {
					x: "21",
					y: "20",
					textAnchor: "middle",
					style: {
						font: "650 8px var(--font-sans)",
						fill: "var(--text)"
					},
					children: centreValue
				}),
				/* @__PURE__ */ jsx("text", {
					x: "21",
					y: "26.5",
					textAnchor: "middle",
					style: {
						font: "500 3.1px var(--font-sans)",
						fill: "var(--text-muted)",
						letterSpacing: "0.04em",
						textTransform: "uppercase"
					},
					children: centreLabel
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "chart-legend",
			style: {
				flexDirection: "column",
				gap: 6
			},
			children: segments.map((seg) => /* @__PURE__ */ jsxs("span", {
				className: "legend-item",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "legend-swatch",
						style: { background: TONE_COLORS[seg.tone] },
						"aria-hidden": "true"
					}),
					seg.label,
					" — ",
					/* @__PURE__ */ jsx("strong", { children: seg.value })
				]
			}, seg.label))
		})]
	});
}
/** Simple sparkline for report cards. */
function Sparkline({ values, tone = "accent", height = 34, ariaLabel }) {
	const max = Math.max(...values, 1);
	const min = Math.min(...values, 0);
	const range = Math.max(max - min, 1);
	const pts = values.map((v, i) => `${i / (values.length - 1) * 100},${height - 3 - (v - min) / range * (height - 6)}`).join(" ");
	return /* @__PURE__ */ jsx("svg", {
		viewBox: `0 0 100 ${height}`,
		preserveAspectRatio: "none",
		style: {
			width: "100%",
			height
		},
		role: "img",
		"aria-label": ariaLabel,
		children: /* @__PURE__ */ jsx("polyline", {
			points: pts,
			fill: "none",
			stroke: TONE_COLORS[tone],
			strokeWidth: "2",
			vectorEffect: "non-scaling-stroke"
		})
	});
}
/** Horizontal comparison bars with visible values. */
function HBarChart({ rows, ariaLabel, unit }) {
	const max = Math.max(...rows.map((r) => r.value), 1);
	return /* @__PURE__ */ jsx("div", {
		role: "img",
		"aria-label": ariaLabel,
		style: {
			display: "flex",
			flexDirection: "column",
			gap: 8
		},
		children: rows.map((r) => /* @__PURE__ */ jsxs("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "130px 1fr auto",
				gap: 10,
				alignItems: "center",
				fontSize: "var(--fs-sm)"
			},
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "text-secondary",
					style: {
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis"
					},
					title: r.label,
					children: r.label
				}),
				/* @__PURE__ */ jsx("span", {
					style: {
						background: "var(--tone-grey-bg)",
						borderRadius: 3,
						height: 8,
						overflow: "hidden"
					},
					children: /* @__PURE__ */ jsx("span", { style: {
						display: "block",
						height: "100%",
						width: `${r.value / max * 100}%`,
						background: TONE_COLORS[r.tone ?? "accent"],
						borderRadius: 3
					} })
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "num",
					style: {
						color: "var(--text-secondary)",
						fontWeight: 600
					},
					children: [r.value, unit ?? ""]
				})
			]
		}, r.label))
	});
}
//#endregion
//#region src/pages/dashboard/DashboardPage.tsx
function woProgress$1(tasksDone, tasksTotal) {
	return tasksTotal === 0 ? 0 : tasksDone / tasksTotal * 100;
}
function DashboardPage() {
	const mine = myWorkOrders().filter((w) => w.status !== "Closed" && w.status !== "Cancelled");
	const recentMaintenance = [...maintenanceRecords].sort((a, b) => b.performedAt.localeCompare(a.performedAt)).slice(0, 4);
	const recentAudit = auditLogs.slice(0, 5);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Operations dashboard",
				description: `Good afternoon, ${currentUser.name.split(" ")[0]}. Fleet position for Wednesday 15 July — 1 aircraft AOG, 1 release pending, 4 defects awaiting review.`,
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(Link, {
					to: paths.defectNew,
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(TriangleAlert, {
						size: 15,
						"aria-hidden": "true"
					}), "Report defect"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: paths.fleetAvailability,
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(PlaneTakeoff, {
						size: 15,
						"aria-hidden": "true"
					}), "Availability board"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Available",
						value: fleetSummary.available,
						tone: "green",
						icon: PlaneTakeoff,
						meta: `of ${fleetSummary.total} aircraft`,
						to: paths.fleetAvailability
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Assigned",
						value: fleetSummary.assigned,
						tone: "amber",
						icon: Route$1,
						meta: "operating today’s schedule",
						to: paths.fleetAvailability
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "AOG",
						value: fleetSummary.aog,
						tone: "red",
						icon: OctagonAlert,
						meta: "VH-RXT at MQL — pump inbound",
						to: paths.workOrder("WO-2026-0033")
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Awaiting sign-off",
						value: fleetSummary.awaitingSignOff,
						tone: "orange",
						icon: FileCheck2,
						meta: "VH-TRW — needed by 17:30",
						to: paths.workOrderSignOff("WO-2026-0035")
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "At-risk flights",
						value: atRiskFlights.length,
						tone: "orange",
						icon: TriangleAlert,
						meta: "next: ASR-241 dep 18:40",
						to: paths.flights
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Defects to review",
						value: reviewQueueDefects.length,
						tone: "blue",
						icon: Inbox,
						meta: "oldest reported 15:48 yesterday",
						to: paths.defectReview
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Open work orders",
						value: openWorkOrders.length,
						tone: "blue",
						icon: Wrench,
						meta: "2 blocked on parts",
						to: paths.workOrders
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Assigned to you",
						value: mine.length,
						icon: ClipboardCheck,
						meta: "1 inspection · 1 sign-off · 1 check",
						to: paths.myWorkOrders
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "dash-grid",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "dash-col",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "card-header",
								children: [/* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(TriangleAlert, {
										size: 16,
										"aria-hidden": "true"
									}), "Flights needing attention"]
								}), /* @__PURE__ */ jsx("div", {
									className: "card-actions",
									children: /* @__PURE__ */ jsxs(Link, {
										to: paths.flights,
										className: "btn btn--ghost btn--sm",
										children: ["All flights", /* @__PURE__ */ jsx(ArrowRight, {
											size: 13,
											"aria-hidden": "true"
										})]
									})
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: atRiskFlights.map((f) => /* @__PURE__ */ jsxs("div", {
									className: "row-list-item",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "row-main",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-title",
											children: [
												/* @__PURE__ */ jsx(Link, {
													to: paths.flight(f.id),
													className: "table-link ref",
													children: f.id
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "text-secondary",
													children: [
														f.origin,
														" → ",
														f.destination
													]
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "muted",
													style: { fontSize: "var(--fs-sm)" },
													children: [
														"dep ",
														fmtDayMonth(f.schedDep),
														", ",
														fmtTime(f.schedDep)
													]
												})
											]
										}), /* @__PURE__ */ jsx("div", {
											className: "row-sub",
											children: f.riskNote
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "row-end",
										children: [f.aircraftId ? /* @__PURE__ */ jsx(Link, {
											to: paths.aircraftDetail(f.aircraftId),
											className: "chip ref",
											children: f.aircraftId
										}) : /* @__PURE__ */ jsx("span", {
											className: "chip chip--alert",
											children: "Unassigned"
										}), /* @__PURE__ */ jsx(RiskBadge, { risk: f.risk })]
									})]
								}, f.id))
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "card-header",
								children: [/* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(Inbox, {
										size: 16,
										"aria-hidden": "true"
									}), "New defects requiring review"]
								}), /* @__PURE__ */ jsx("div", {
									className: "card-actions",
									children: /* @__PURE__ */ jsxs(Link, {
										to: paths.defectReview,
										className: "btn btn--ghost btn--sm",
										children: ["Open review queue", /* @__PURE__ */ jsx(ArrowRight, {
											size: 13,
											"aria-hidden": "true"
										})]
									})
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: reviewQueueDefects.map((d) => /* @__PURE__ */ jsxs("div", {
									className: "row-list-item",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "row-main",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-title",
											children: [/* @__PURE__ */ jsx(Link, {
												to: paths.defect(d.id),
												className: "table-link ref",
												children: d.id
											}), /* @__PURE__ */ jsx("span", { children: d.title })]
										}), /* @__PURE__ */ jsxs("div", {
											className: "row-sub",
											children: [
												/* @__PURE__ */ jsx(Link, {
													to: paths.aircraftDetail(d.aircraftId),
													className: "ref",
													children: d.aircraftId
												}),
												" ",
												"· reported ",
												fmtRelative(d.reportedAt),
												" by ",
												shortName(d.reportedByUserId),
												" · ",
												d.ataChapter
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "row-end",
										children: [/* @__PURE__ */ jsx(SeverityBadge, { severity: d.severity }), /* @__PURE__ */ jsx(StatusBadge, { status: d.status })]
									})]
								}, d.id))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
								gap: "var(--sp-5)"
							},
							children: [/* @__PURE__ */ jsxs("section", {
								className: "card",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "card-header",
										children: /* @__PURE__ */ jsx("h2", {
											className: "card-title",
											children: "Seven-day fleet availability"
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "card-body",
										children: /* @__PURE__ */ jsx(StackedBarChart, {
											ariaLabel: "Stacked daily counts of available, maintenance and AOG aircraft across the past seven days",
											labels: availabilityTrend.map((d) => d.label),
											series: [
												{
													label: "Available / assigned",
													tone: "green",
													values: availabilityTrend.map((d) => d.available)
												},
												{
													label: "Maintenance & awaiting",
													tone: "amber",
													values: availabilityTrend.map((d) => d.maintenance)
												},
												{
													label: "AOG",
													tone: "red",
													values: availabilityTrend.map((d) => d.aog)
												}
											]
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "card-footer",
										children: "Dip on Wed reflects the VH-MSA A-Check plus the VH-RXT grounding."
									})
								]
							}), /* @__PURE__ */ jsxs("section", {
								className: "card",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "card-header",
										children: /* @__PURE__ */ jsx("h2", {
											className: "card-title",
											children: "Open defects by severity"
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "card-body",
										children: /* @__PURE__ */ jsx(DonutChart, {
											ariaLabel: "Open defects by severity: 1 critical, 4 significant and 4 minor",
											centreValue: String(defectSeverityBreakdown.critical + defectSeverityBreakdown.significant + defectSeverityBreakdown.minor),
											centreLabel: "Open",
											segments: [
												{
													label: "Critical",
													value: defectSeverityBreakdown.critical,
													tone: "red"
												},
												{
													label: "Significant",
													value: defectSeverityBreakdown.significant,
													tone: "orange"
												},
												{
													label: "Minor",
													value: defectSeverityBreakdown.minor,
													tone: "blue"
												}
											]
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "card-footer",
										children: /* @__PURE__ */ jsx(Link, {
											to: paths.defects,
											children: "Review the defect log"
										})
									})
								]
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "dash-col",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "card-header",
									children: [/* @__PURE__ */ jsxs("h2", {
										className: "card-title",
										children: [/* @__PURE__ */ jsx(ClipboardCheck, {
											size: 16,
											"aria-hidden": "true"
										}), "Your assignments"]
									}), /* @__PURE__ */ jsx("div", {
										className: "card-actions",
										children: /* @__PURE__ */ jsx(Link, {
											to: paths.myWorkOrders,
											className: "btn btn--ghost btn--sm",
											children: "View all"
										})
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "row-list",
									children: mine.map((w) => /* @__PURE__ */ jsxs("div", {
										className: "row-list-item",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-main",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "row-title",
													children: [/* @__PURE__ */ jsx(Link, {
														to: paths.workOrder(w.id),
														className: "table-link ref",
														children: w.id
													}), /* @__PURE__ */ jsx(PriorityBadge, { priority: w.priority })]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "row-sub",
													children: [
														w.title,
														" · ",
														/* @__PURE__ */ jsx("span", {
															className: "ref",
															children: w.aircraftId
														})
													]
												}),
												/* @__PURE__ */ jsx("div", {
													style: { marginTop: 6 },
													children: /* @__PURE__ */ jsx(ProgressBar, {
														value: woProgress$1(w.tasks.filter((t) => t.done).length, w.tasks.length),
														tone: w.status === "Ready for Sign-off" ? "orange" : void 0,
														label: `${w.tasks.filter((t) => t.done).length} of ${w.tasks.length} tasks complete`
													})
												})
											]
										}), /* @__PURE__ */ jsx("div", {
											className: "row-end",
											children: /* @__PURE__ */ jsx(StatusBadge, { status: w.status })
										})]
									}, w.id))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "card-footer",
									children: [/* @__PURE__ */ jsx(FileCheck2, {
										size: 14,
										"aria-hidden": "true"
									}), /* @__PURE__ */ jsxs("span", { children: [
										"VH-TRW release due 17:30 —",
										" ",
										/* @__PURE__ */ jsx(Link, {
											to: paths.workOrderSignOff("WO-2026-0035"),
											children: "open sign-off"
										})
									] })]
								})
							]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "card-header",
								children: [/* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(CalendarClock, {
										size: 16,
										"aria-hidden": "true"
									}), "Upcoming planned maintenance"]
								}), /* @__PURE__ */ jsx("div", {
									className: "card-actions",
									children: /* @__PURE__ */ jsx(Link, {
										to: paths.plannedMaintenance,
										className: "btn btn--ghost btn--sm",
										children: "Calendar"
									})
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: upcomingMaintenance.slice(0, 5).map((e) => /* @__PURE__ */ jsxs("div", {
									className: "row-list-item",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "row-main",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-title",
											children: [/* @__PURE__ */ jsx(Link, {
												to: paths.aircraftDetail(e.aircraftId),
												className: "table-link ref",
												children: e.aircraftId
											}), /* @__PURE__ */ jsx("span", { children: e.checkType })]
										}), /* @__PURE__ */ jsxs("div", {
											className: "row-sub",
											children: [
												fmtDateTime(e.plannedStart),
												" · ",
												e.facility
											]
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "row-end",
										children: /* @__PURE__ */ jsx(StatusBadge, { status: e.status === "In Progress" ? "In Progress" : e.planningRisk })
									})]
								}, e.id))
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "card-header",
									children: /* @__PURE__ */ jsxs("h2", {
										className: "card-title",
										children: [/* @__PURE__ */ jsx(Wrench, {
											size: 16,
											"aria-hidden": "true"
										}), "Recent maintenance activity"]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "row-list",
									children: recentMaintenance.map((r) => /* @__PURE__ */ jsx("div", {
										className: "row-list-item",
										children: /* @__PURE__ */ jsxs("div", {
											className: "row-main",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "row-title",
													style: { fontSize: "var(--fs-md)" },
													children: [/* @__PURE__ */ jsx(Link, {
														to: paths.workOrder(r.workOrderId),
														className: "table-link ref",
														children: r.workOrderId
													}), /* @__PURE__ */ jsx("span", {
														className: "ref muted",
														children: r.aircraftId
													})]
												}),
												/* @__PURE__ */ jsx("div", {
													className: "row-sub",
													children: r.summary
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "row-sub",
													style: { marginTop: 1 },
													children: [
														fmtDateTime(r.performedAt),
														" · certified ",
														shortName(r.certifiedByUserId)
													]
												})
											]
										})
									}, r.id))
								}),
								/* @__PURE__ */ jsx("div", {
									className: "card-footer",
									children: /* @__PURE__ */ jsx(Link, {
										to: paths.maintenanceRecords,
										children: "All maintenance records"
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "card-header",
								children: [/* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(ScrollText, {
										size: 16,
										"aria-hidden": "true"
									}), "Recent audit activity"]
								}), /* @__PURE__ */ jsx("div", {
									className: "card-actions",
									children: /* @__PURE__ */ jsx(Link, {
										to: paths.adminAuditLogs,
										className: "btn btn--ghost btn--sm",
										children: "Audit logs"
									})
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: recentAudit.map((a) => /* @__PURE__ */ jsxs("div", {
									className: "row-list-item",
									style: { alignItems: "flex-start" },
									children: [/* @__PURE__ */ jsxs("div", {
										className: "row-main",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-sub",
											style: { marginTop: 0 },
											children: [
												/* @__PURE__ */ jsx("code", {
													className: "ref",
													style: { color: "var(--text-secondary)" },
													children: a.action
												}),
												" ·",
												" ",
												shortName(a.userId),
												" · ",
												fmtRelative(a.at)
											]
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "var(--fs-md)",
												marginTop: 2
											},
											children: a.summary
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "row-end",
										children: /* @__PURE__ */ jsx(StatusBadge, { status: a.outcome })
									})]
								}, a.id))
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/ui/DataTable.tsx
/**
* Dense operational table. Horizontal scrolling is handled by the
* wrapper so wide tables never force page overflow; low-priority
* columns can opt out on mobile via `hideMobile`.
*/
function DataTable({ columns, rows, rowKey, rowTone, caption, compact, empty, footer }) {
	if (rows.length === 0 && empty) return /* @__PURE__ */ jsx(Fragment$1, { children: empty });
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
		className: "table-wrap",
		children: /* @__PURE__ */ jsxs("table", {
			className: `data-table${compact ? " data-table--compact" : ""}`,
			children: [
				/* @__PURE__ */ jsx("caption", {
					className: "visually-hidden",
					children: caption
				}),
				/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsx("th", {
					scope: "col",
					className: `${c.numeric ? "num" : ""} ${c.hideMobile ? "hide-mobile" : ""}`.trim() || void 0,
					style: c.width ? { width: c.width } : void 0,
					children: c.header
				}, c.key)) }) }),
				/* @__PURE__ */ jsx("tbody", { children: rows.map((row) => /* @__PURE__ */ jsx("tr", {
					"data-row-tone": rowTone?.(row),
					children: columns.map((c) => /* @__PURE__ */ jsx("td", {
						className: `${c.numeric ? "num" : ""} ${c.hideMobile ? "hide-mobile" : ""}`.trim() || void 0,
						children: c.render(row)
					}, c.key))
				}, rowKey(row))) })
			]
		})
	}), footer] });
}
/** Standard "n of n" table footer with optional pagination slot. */
function TableFooter({ shown, total, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "table-foot",
		children: [/* @__PURE__ */ jsxs("span", { children: [
			"Showing ",
			shown,
			" of ",
			total
		] }), children]
	});
}
//#endregion
//#region src/components/ui/FilterBar.tsx
/** Toolbar row for search + filter controls above tables/boards. */
function FilterBar({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "filter-bar",
		children
	});
}
function FilterSpacer() {
	return /* @__PURE__ */ jsx("span", {
		className: "filter-spacer",
		"aria-hidden": "true"
	});
}
function SearchInput({ placeholder, value, onChange, label, width }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "search-input",
		style: width ? { width } : void 0,
		children: [/* @__PURE__ */ jsx(Search, {
			size: 14,
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsx("input", {
			type: "search",
			placeholder,
			"aria-label": label ?? placeholder,
			value,
			onChange: onChange ? (e) => onChange(e.target.value) : void 0,
			readOnly: !onChange
		})]
	});
}
function SelectFilter({ label, options, value, onChange, allLabel }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "select-control",
		children: [/* @__PURE__ */ jsxs("select", {
			"aria-label": label,
			value,
			onChange: onChange ? (e) => onChange(e.target.value) : void 0,
			children: [allLabel && /* @__PURE__ */ jsx("option", {
				value: "",
				children: allLabel
			}), options.map((o) => /* @__PURE__ */ jsx("option", {
				value: o,
				children: o
			}, o))]
		}), /* @__PURE__ */ jsx(ChevronDown, {
			size: 14,
			"aria-hidden": "true"
		})]
	});
}
/** Segmented view toggle (e.g. table / board / calendar). */
function Segmented({ options, value, onChange, label }) {
	return /* @__PURE__ */ jsx("div", {
		className: "segmented",
		role: "group",
		"aria-label": label,
		children: options.map((o) => /* @__PURE__ */ jsxs("button", {
			type: "button",
			"aria-pressed": value === o.value,
			onClick: () => onChange(o.value),
			children: [o.icon, o.label]
		}, o.value))
	});
}
//#endregion
//#region src/pages/fleet/FleetAvailabilityPage.tsx
var TYPE_OPTIONS$1 = [
	"ATR 72-600",
	"DHC-8-315",
	"Saab 340B",
	"King Air 350"
];
var STATUS_OPTIONS$5 = [
	"Available",
	"Assigned",
	"Restricted",
	"Under Maintenance",
	"AOG",
	"Awaiting Parts",
	"Awaiting Sign-off"
];
function FleetAvailabilityPage() {
	const [q, setQ] = useState("");
	const [type, setType] = useState("");
	const [status, setStatus] = useState("");
	const [view, setView] = useState("table");
	const rows = useMemo(() => aircraft.filter((a) => {
		const text = `${a.registration} ${a.model} ${a.availabilityReason} ${a.location}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (type && a.model !== type) return false;
		if (status && a.availability !== status) return false;
		return true;
	}), [
		q,
		type,
		status
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Fleet planning" }, { label: "Availability" }],
				title: "Fleet availability",
				description: "Live operational picture of every tail: who can fly, who is stuck, and why. Statuses follow the documented availability workflow.",
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(RefreshCw, {
						size: 15,
						"aria-hidden": "true"
					}), "Refresh view"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: paths.fleetPlan("FP-2026-0715"),
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(CalendarDays, {
						size: 15,
						"aria-hidden": "true"
					}), "Current plan"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "stat-strip",
				role: "group",
				"aria-label": "Fleet status summary",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Fleet"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: fleetSummary.total
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "stat-label",
							children: [/* @__PURE__ */ jsx("span", {
								className: "badge-dot",
								style: {
									background: "var(--tone-green-dot)",
									width: 7,
									height: 7,
									borderRadius: 99,
									display: "inline-block"
								},
								"aria-hidden": "true"
							}), "Available"]
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: fleetSummary.available
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Assigned"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: fleetSummary.assigned
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Restricted"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: fleetSummary.restricted
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Maintenance"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: fleetSummary.underMaintenance
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Awaiting parts"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: fleetSummary.awaitingParts
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Awaiting sign-off"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: fleetSummary.awaitingSignOff
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							style: { color: "var(--tone-red-text)" },
							children: "AOG"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							style: { color: "var(--tone-red-text)" },
							children: fleetSummary.aog
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search registration, reason, location…",
							value: q,
							onChange: setQ,
							width: 280
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Aircraft type",
							allLabel: "All types",
							options: TYPE_OPTIONS$1,
							value: type,
							onChange: setType
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Availability status",
							allLabel: "All statuses",
							options: STATUS_OPTIONS$5,
							value: status,
							onChange: setStatus
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Operational window",
							options: [
								"Today · Wed 15 Jul",
								"Tomorrow · Thu 16 Jul",
								"Next 7 days"
							]
						}),
						/* @__PURE__ */ jsx(FilterSpacer, {}),
						/* @__PURE__ */ jsx(Segmented, {
							label: "View",
							value: view,
							onChange: setView,
							options: [{
								label: "Table",
								value: "table",
								icon: /* @__PURE__ */ jsx(Rows3, {
									size: 13,
									"aria-hidden": "true"
								})
							}, {
								label: "Board",
								value: "board",
								icon: /* @__PURE__ */ jsx(LayoutGrid, {
									size: 13,
									"aria-hidden": "true"
								})
							}]
						})
					] })
				}), view === "table" ? /* @__PURE__ */ jsx(DataTable, {
					caption: "Fleet availability by aircraft",
					columns: [
						{
							key: "reg",
							header: "Registration",
							render: (a) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
								to: paths.aircraftDetail(a.id),
								className: "table-link ref",
								children: a.registration
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: a.location
							})] })
						},
						{
							key: "type",
							header: "Type",
							hideMobile: true,
							render: (a) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "cell-main",
								style: { fontWeight: 500 },
								children: a.model
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: a.serialNumber
							})] })
						},
						{
							key: "status",
							header: "Availability",
							render: (a) => /* @__PURE__ */ jsx(StatusCell, {
								status: a.availability,
								reason: a.availabilityReason
							})
						},
						{
							key: "next-flight",
							header: "Next flight",
							render: (a) => {
								const f = a.nextFlightId ? getFlight(a.nextFlightId) : void 0;
								if (!f) return /* @__PURE__ */ jsx("span", {
									className: "muted",
									children: "—"
								});
								return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
									to: paths.flight(f.id),
									className: "table-link ref",
									children: f.id
								}), /* @__PURE__ */ jsxs("span", {
									className: "cell-sub",
									children: [
										f.origin,
										" → ",
										f.destination
									]
								})] });
							}
						},
						{
							key: "dep",
							header: "Departure",
							hideMobile: true,
							render: (a) => {
								const f = a.nextFlightId ? getFlight(a.nextFlightId) : void 0;
								if (!f) return /* @__PURE__ */ jsx("span", {
									className: "muted",
									children: "—"
								});
								return /* @__PURE__ */ jsxs("span", {
									className: "nowrap num",
									children: [
										fmtDayMonth(f.schedDep),
										", ",
										fmtTime(f.schedDep)
									]
								});
							}
						},
						{
							key: "risk",
							header: "Maint. risk",
							render: (a) => /* @__PURE__ */ jsx(RiskBadge, { risk: a.maintenanceRisk })
						},
						{
							key: "defects",
							header: "Defects",
							numeric: true,
							render: (a) => {
								const n = openDefectCount(a.id);
								return n > 0 ? /* @__PURE__ */ jsxs(Link, {
									to: paths.defects,
									className: `chip${a.availability === "AOG" ? " chip--alert" : ""}`,
									children: [n, " open"]
								}) : /* @__PURE__ */ jsx("span", {
									className: "muted",
									children: "0"
								});
							}
						},
						{
							key: "wos",
							header: "Work orders",
							numeric: true,
							render: (a) => {
								const n = openWorkOrderCount(a.id);
								return n > 0 ? /* @__PURE__ */ jsxs(Link, {
									to: paths.workOrders,
									className: "chip",
									children: [n, " open"]
								}) : /* @__PURE__ */ jsx("span", {
									className: "muted",
									children: "0"
								});
							}
						},
						{
							key: "plan",
							header: "Fleet plan",
							hideMobile: true,
							render: (a) => a.assignedPlanId ? /* @__PURE__ */ jsx(Link, {
								to: paths.fleetPlan(a.assignedPlanId),
								className: "table-link ref",
								children: a.assignedPlanId
							}) : /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "Unplanned"
							})
						}
					],
					rows,
					rowKey: (a) => a.id,
					rowTone: (a) => a.availability === "AOG" ? "red" : a.availability === "Awaiting Parts" || a.availability === "Awaiting Sign-off" ? "orange" : void 0,
					empty: /* @__PURE__ */ jsx(EmptyState, {
						icon: Plane,
						title: "No aircraft match these filters",
						children: "Adjust the search or clear a filter to see the rest of the fleet."
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: aircraft.length
					})
				}) : /* @__PURE__ */ jsx("div", {
					className: "card-body",
					children: /* @__PURE__ */ jsx("div", {
						className: "card-list",
						children: rows.map((a) => /* @__PURE__ */ jsxs("div", {
							className: "item-card",
							"data-tone": a.availability === "AOG" ? "red" : a.availability === "Awaiting Parts" || a.availability === "Awaiting Sign-off" ? "orange" : void 0,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "item-card-head",
									children: [
										/* @__PURE__ */ jsx(Link, {
											to: paths.aircraftDetail(a.id),
											className: "table-link ref item-card-title",
											children: a.registration
										}),
										/* @__PURE__ */ jsx("span", {
											className: "muted",
											style: { fontSize: "var(--fs-sm)" },
											children: a.model
										}),
										/* @__PURE__ */ jsx("span", {
											style: { marginLeft: "auto" },
											children: /* @__PURE__ */ jsx(RiskBadge, { risk: a.maintenanceRisk })
										})
									]
								}),
								/* @__PURE__ */ jsx(StatusCell, {
									status: a.availability,
									reason: a.availabilityReason
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "item-card-meta",
									children: [
										/* @__PURE__ */ jsx("span", { children: a.location }),
										/* @__PURE__ */ jsxs("span", { children: [openDefectCount(a.id), " defects"] }),
										/* @__PURE__ */ jsxs("span", { children: [openWorkOrderCount(a.id), " WOs"] })
									]
								})
							]
						}, a.id))
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/fleet/FleetPlansPage.tsx
var STATUS_OPTIONS$4 = [
	"Published",
	"Draft",
	"Archived"
];
function FleetPlansPage() {
	const currentPlan = getFleetPlan("FP-2026-0715");
	const [q, setQ] = useState("");
	const [status, setStatus] = useState("");
	const [view, setView] = useState("list");
	const rows = useMemo(() => fleetPlans.filter((p) => {
		const text = `${p.id} ${p.name} ${p.description} ${p.base}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (status && p.status !== status) return false;
		return true;
	}), [q, status]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Fleet planning" }, { label: "Plans" }],
				title: "Fleet plans",
				description: "Weekly operating plans linking aircraft, flights and maintenance windows. Published plans drive the availability board; drafts are visible only to fleet planning.",
				actions: /* @__PURE__ */ jsxs(Link, {
					to: paths.fleetPlanNew,
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Plus, {
						size: 15,
						"aria-hidden": "true"
					}), "New plan"]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs("h2", {
						className: "card-title",
						children: [/* @__PURE__ */ jsx(CalendarRange, {
							size: 16,
							"aria-hidden": "true"
						}), "Current published plan"]
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "card-body",
					children: /* @__PURE__ */ jsxs("div", {
						className: "row-list-item",
						style: {
							padding: 0,
							border: "none"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							className: "row-main",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "row-title",
									style: { fontSize: "var(--fs-md)" },
									children: [
										/* @__PURE__ */ jsx(Link, {
											to: paths.fleetPlan(currentPlan.id),
											className: "table-link ref",
											children: currentPlan.id
										}),
										/* @__PURE__ */ jsx("span", { children: currentPlan.name }),
										/* @__PURE__ */ jsx(StatusBadge, { status: currentPlan.status })
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "row-sub",
									children: [
										fmtDayMonth(currentPlan.startDate),
										" – ",
										fmtDayMonth(currentPlan.endDate),
										" · Base ",
										currentPlan.base,
										" ·",
										" ",
										currentPlan.aircraftIds.length,
										" aircraft · ",
										currentPlan.flightIds.length,
										" flights ·",
										" ",
										currentPlan.conflicts.length,
										" conflicts flagged"
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "row-sub",
									children: [
										"Approved by ",
										shortName(currentPlan.approvedByUserId),
										currentPlan.approvedAt ? ` · ${fmtDateTime(currentPlan.approvedAt)}` : ""
									]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "row-end",
							children: /* @__PURE__ */ jsx(Link, {
								to: paths.fleetPlan(currentPlan.id),
								className: "btn btn--secondary btn--sm",
								children: "View plan"
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search plan name, reference, base…",
							value: q,
							onChange: setQ,
							width: 280
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Status",
							allLabel: "All statuses",
							options: STATUS_OPTIONS$4,
							value: status,
							onChange: setStatus
						}),
						/* @__PURE__ */ jsx(FilterSpacer, {}),
						/* @__PURE__ */ jsx(Segmented, {
							label: "View",
							value: view,
							onChange: setView,
							options: [{
								label: "List",
								value: "list",
								icon: /* @__PURE__ */ jsx(Rows3, {
									size: 13,
									"aria-hidden": "true"
								})
							}, {
								label: "Calendar",
								value: "calendar",
								icon: /* @__PURE__ */ jsx(LayoutGrid, {
									size: 13,
									"aria-hidden": "true"
								})
							}]
						})
					] })
				}), view === "list" ? /* @__PURE__ */ jsx(DataTable, {
					caption: "Fleet plans",
					columns: [
						{
							key: "name",
							header: "Name",
							render: (p) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
								to: paths.fleetPlan(p.id),
								className: "table-link",
								children: p.name
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								title: p.description,
								children: p.description.length > 84 ? `${p.description.slice(0, 84)}…` : p.description
							})] })
						},
						{
							key: "range",
							header: "Date range",
							render: (p) => /* @__PURE__ */ jsxs("span", {
								className: "nowrap",
								children: [
									fmtDayMonth(p.startDate),
									" – ",
									fmtDayMonth(p.endDate)
								]
							})
						},
						{
							key: "status",
							header: "Status",
							render: (p) => /* @__PURE__ */ jsx(StatusBadge, { status: p.status })
						},
						{
							key: "createdBy",
							header: "Created by",
							hideMobile: true,
							render: (p) => shortName(p.createdByUserId)
						},
						{
							key: "updated",
							header: "Last updated",
							hideMobile: true,
							render: (p) => /* @__PURE__ */ jsx("span", {
								className: "nowrap",
								children: fmtDateTime(p.updatedAt)
							})
						},
						{
							key: "aircraft",
							header: "Aircraft",
							numeric: true,
							render: (p) => p.aircraftIds.length
						},
						{
							key: "flights",
							header: "Flights",
							numeric: true,
							render: (p) => p.flightIds.length
						},
						{
							key: "edit",
							header: "",
							render: (p) => p.status === "Draft" ? /* @__PURE__ */ jsx(Link, {
								to: paths.fleetPlanEdit(p.id),
								className: "table-link",
								children: "Edit"
							}) : /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "—"
							})
						}
					],
					rows,
					rowKey: (p) => p.id,
					empty: /* @__PURE__ */ jsx(EmptyState, {
						icon: CalendarRange,
						title: "No plans match these filters",
						children: "Adjust the search or clear the status filter to see the rest of the plan history."
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: fleetPlans.length
					})
				}) : /* @__PURE__ */ jsx("div", {
					className: "card-body",
					children: /* @__PURE__ */ jsx("div", {
						className: "card-list",
						children: rows.map((p) => /* @__PURE__ */ jsxs("div", {
							className: "item-card",
							"data-tone": p.conflicts.some((c) => c.severity === "Critical") ? "red" : void 0,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "item-card-head",
									children: [/* @__PURE__ */ jsx(Link, {
										to: paths.fleetPlan(p.id),
										className: "table-link ref item-card-title",
										children: p.id
									}), /* @__PURE__ */ jsx("span", {
										style: { marginLeft: "auto" },
										children: /* @__PURE__ */ jsx(StatusBadge, { status: p.status })
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "item-card-body",
									children: p.name
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "item-card-meta",
									children: [
										/* @__PURE__ */ jsxs("span", { children: [
											fmtDayMonth(p.startDate),
											" – ",
											fmtDayMonth(p.endDate)
										] }),
										/* @__PURE__ */ jsxs("span", { children: ["Base ", p.base] }),
										/* @__PURE__ */ jsxs("span", { children: [p.aircraftIds.length, " aircraft"] }),
										/* @__PURE__ */ jsxs("span", { children: [p.flightIds.length, " flights"] }),
										p.conflicts.length > 0 && /* @__PURE__ */ jsxs("span", { children: [p.conflicts.length, " conflicts"] })
									]
								})
							]
						}, p.id))
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/components/ui/EntityHeader.tsx
/** Strong entity header card for detail pages (aircraft, WO, defect…). */
function EntityHeader({ identIcon: IdentIcon, identText, identTone, title, badges, subtitle, meta, actions }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "entity-header",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "entity-ident",
				"data-tone": identTone,
				"aria-hidden": "true",
				children: IdentIcon ? /* @__PURE__ */ jsx(IdentIcon, { size: 24 }) : /* @__PURE__ */ jsx("span", {
					style: {
						fontWeight: 700,
						fontSize: 13
					},
					children: identText
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "entity-head-main",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "entity-title-row",
						children: [/* @__PURE__ */ jsx("h1", { children: title }), badges]
					}),
					subtitle && /* @__PURE__ */ jsx("p", {
						className: "entity-sub",
						children: subtitle
					}),
					meta && meta.length > 0 && /* @__PURE__ */ jsx("div", {
						className: "entity-meta-row",
						children: meta.map((m) => /* @__PURE__ */ jsxs("span", {
							className: "meta-pair",
							children: [
								m.icon && /* @__PURE__ */ jsx(m.icon, {
									size: 13,
									"aria-hidden": "true"
								}),
								m.label,
								": ",
								/* @__PURE__ */ jsx("strong", { children: m.value })
							]
						}, m.label))
					})
				]
			}),
			actions && /* @__PURE__ */ jsx("div", {
				className: "entity-actions",
				children: actions
			})
		]
	});
}
//#endregion
//#region src/components/ui/Timeline.tsx
/**
* Vertical activity timeline. Events are rendered newest-first by
* default (operational convention).
*/
function Timeline({ events, oldestFirst }) {
	return /* @__PURE__ */ jsx("ol", {
		className: "timeline",
		children: [...events].sort((a, b) => oldestFirst ? a.at.localeCompare(b.at) : b.at.localeCompare(a.at)).map((e, i) => /* @__PURE__ */ jsxs("li", {
			className: "timeline-item",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "timeline-dot",
					"data-tone": e.tone ?? "grey",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "timeline-title",
					children: [e.title, /* @__PURE__ */ jsxs("span", {
						className: "timeline-time",
						title: fmtDateTime(e.at),
						children: [
							fmtDateTime(e.at),
							" · ",
							fmtRelative(e.at)
						]
					})]
				}),
				e.detail && /* @__PURE__ */ jsx("p", {
					className: "timeline-body",
					children: e.detail
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "timeline-meta",
					children: [e.byUserId ? userName(e.byUserId) : "System", e.refLink && /* @__PURE__ */ jsxs(Fragment$1, { children: [" · ", /* @__PURE__ */ jsx(Link, {
						to: e.refLink.to,
						children: e.refLink.label
					})] })]
				})
			]
		}, `${e.at}-${i}`))
	});
}
//#endregion
//#region src/pages/NotFoundPage.tsx
/** Shell-preserving not-found page with useful ways back. */
function NotFoundPage() {
	const { pathname } = useLocation();
	return /* @__PURE__ */ jsx("div", {
		className: "page",
		children: /* @__PURE__ */ jsxs("div", {
			className: "notfound",
			children: [
				/* @__PURE__ */ jsxs("span", {
					className: "notfound-code",
					children: ["404 · ", pathname]
				}),
				/* @__PURE__ */ jsx(Compass, {
					size: 40,
					"aria-hidden": "true",
					style: { color: "var(--text-faint)" }
				}),
				/* @__PURE__ */ jsx("h1", { children: "This route isn’t on the flight plan" }),
				/* @__PURE__ */ jsx("p", { children: "The page you’re looking for doesn’t exist in this preview build. It may have moved, or the reference in the address bar may be incorrect." }),
				/* @__PURE__ */ jsxs("div", {
					className: "notfound-actions",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							to: paths.dashboard,
							className: "btn btn--primary",
							children: [/* @__PURE__ */ jsx(LayoutDashboard, {
								size: 15,
								"aria-hidden": "true"
							}), "Back to dashboard"]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: paths.fleetAvailability,
							className: "btn btn--secondary",
							children: [/* @__PURE__ */ jsx(PlaneTakeoff, {
								size: 15,
								"aria-hidden": "true"
							}), "Fleet availability"]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: paths.workOrders,
							className: "btn btn--secondary",
							children: [/* @__PURE__ */ jsx(Wrench, {
								size: 15,
								"aria-hidden": "true"
							}), "Work orders"]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: paths.defectReview,
							className: "btn btn--secondary",
							children: [/* @__PURE__ */ jsx(TriangleAlert, {
								size: 15,
								"aria-hidden": "true"
							}), "Defect review queue"]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/pages/fleet/FleetPlanDetailPage.tsx
function FleetPlanDetailPage() {
	const { id = "" } = useParams();
	const plan = getFleetPlan(id);
	if (!plan) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const planAircraft = plan.aircraftIds.map((aid) => getAircraft(aid)).filter((a) => a !== void 0);
	const planFlights = plan.flightIds.map((fid) => getFlight(fid)).filter((f) => f !== void 0);
	const atRiskPlanFlights = planFlights.filter((f) => f.risk === "At Risk" || f.risk === "No Go");
	const revisionEvents = plan.revisions.map((r) => ({
		at: r.at,
		title: `Revision ${r.version}`,
		detail: r.note,
		byUserId: r.byUserId,
		tone: r.version === 1 ? "grey" : "blue"
	}));
	const aircraftCols = [
		{
			key: "reg",
			header: "Registration",
			render: (a) => /* @__PURE__ */ jsx(Link, {
				to: paths.aircraftDetail(a.id),
				className: "table-link ref",
				children: a.registration
			})
		},
		{
			key: "model",
			header: "Model",
			hideMobile: true,
			render: (a) => a.model
		},
		{
			key: "status",
			header: "Availability",
			render: (a) => /* @__PURE__ */ jsx(StatusCell, {
				status: a.availability,
				reason: a.availabilityReason
			})
		},
		{
			key: "risk",
			header: "Maint. risk",
			render: (a) => /* @__PURE__ */ jsx(RiskBadge, { risk: a.maintenanceRisk })
		}
	];
	const flightCols = [
		{
			key: "flight",
			header: "Flight",
			render: (f) => /* @__PURE__ */ jsx(Link, {
				to: paths.flight(f.id),
				className: "table-link ref",
				children: f.id
			})
		},
		{
			key: "route",
			header: "Route",
			render: (f) => /* @__PURE__ */ jsxs("span", {
				className: "nowrap",
				children: [
					f.origin,
					" → ",
					f.destination
				]
			})
		},
		{
			key: "dep",
			header: "Sched dep",
			render: (f) => /* @__PURE__ */ jsxs("span", {
				className: "nowrap",
				children: [
					fmtDayMonth(f.schedDep),
					", ",
					fmtTime(f.schedDep)
				]
			})
		},
		{
			key: "aircraft",
			header: "Aircraft",
			render: (f) => f.aircraftId ? /* @__PURE__ */ jsx(Link, {
				to: paths.aircraftDetail(f.aircraftId),
				className: "chip ref",
				children: f.aircraftId
			}) : /* @__PURE__ */ jsx("span", {
				className: "chip chip--alert",
				children: "Unassigned"
			})
		},
		{
			key: "risk",
			header: "Risk",
			render: (f) => /* @__PURE__ */ jsx(RiskBadge, { risk: f.risk })
		},
		{
			key: "status",
			header: "Status",
			render: (f) => /* @__PURE__ */ jsx(StatusBadge, { status: f.status })
		}
	];
	const flightRowTone = (f) => f.risk === "No Go" ? "red" : f.risk === "At Risk" ? "orange" : void 0;
	const conflictTone = (severity) => severity === "Critical" ? "Critical" : "Monitor";
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(Breadcrumbs, { crumbs: [
				{ label: "Fleet planning" },
				{
					label: "Fleet plans",
					to: paths.fleetPlans
				},
				{ label: plan.id }
			] }),
			/* @__PURE__ */ jsx(EntityHeader, {
				identIcon: CalendarRange,
				title: plan.name,
				badges: /* @__PURE__ */ jsx(StatusBadge, { status: plan.status }),
				subtitle: /* @__PURE__ */ jsx("span", {
					className: "ref",
					children: plan.id
				}),
				meta: [
					{
						label: "Period",
						value: `${fmtDate(plan.startDate)} – ${fmtDate(plan.endDate)}`
					},
					{
						label: "Base",
						value: plan.base
					},
					{
						label: "Owner",
						value: userName(plan.createdByUserId)
					},
					{
						label: "Approved",
						value: plan.approvedByUserId && plan.approvedAt ? `${userName(plan.approvedByUserId)} · ${fmtDateTime(plan.approvedAt)}` : "Not yet approved"
					}
				],
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(Link, {
					to: paths.fleetPlanEdit(plan.id),
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(Pencil, {
						size: 15,
						"aria-hidden": "true"
					}), "Edit plan"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: paths.fleetAvailability,
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(PlaneTakeoff, {
						size: 15,
						"aria-hidden": "true"
					}), "Availability board"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "two-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "col-main",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "card-header",
								children: [/* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(TriangleAlert, {
										size: 16,
										"aria-hidden": "true"
									}), "Conflicts & warnings"]
								}), /* @__PURE__ */ jsxs("span", {
									className: "card-sub",
									children: [plan.conflicts.length, " flagged for this plan"]
								})]
							}), plan.conflicts.length === 0 ? /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(EmptyState, {
									icon: ListChecks,
									title: "No conflicts flagged",
									children: "Aircraft and flight assignments in this plan have no outstanding warnings."
								})
							}) : /* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: plan.conflicts.map((c, i) => /* @__PURE__ */ jsxs("div", {
									className: "row-list-item",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "row-main",
										children: [/* @__PURE__ */ jsx("div", {
											className: "row-title",
											children: /* @__PURE__ */ jsx(StatusBadge, { status: conflictTone(c.severity) })
										}), /* @__PURE__ */ jsx("div", {
											className: "row-sub",
											children: c.message
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "row-end",
										children: [c.aircraftId && /* @__PURE__ */ jsx(Link, {
											to: paths.aircraftDetail(c.aircraftId),
											className: "chip ref",
											children: c.aircraftId
										}), c.flightId && /* @__PURE__ */ jsx(Link, {
											to: paths.flight(c.flightId),
											className: "chip ref",
											children: c.flightId
										})]
									})]
								}, `${c.message}-${i}`))
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "card-header",
								children: [/* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(PlaneTakeoff, {
										size: 16,
										"aria-hidden": "true"
									}), "Aircraft assignments"]
								}), /* @__PURE__ */ jsxs("span", {
									className: "card-sub",
									children: [planAircraft.length, " tails assigned to this plan"]
								})]
							}), /* @__PURE__ */ jsx(DataTable, {
								caption: `Aircraft assigned to ${plan.id}`,
								columns: aircraftCols,
								rows: planAircraft,
								rowKey: (a) => a.id,
								rowTone: (a) => a.availability === "AOG" ? "red" : void 0,
								empty: /* @__PURE__ */ jsx(EmptyState, {
									icon: PlaneTakeoff,
									title: "No aircraft assigned",
									children: "This plan has not had aircraft assigned yet."
								})
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "card-header",
								children: [/* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(CalendarRange, {
										size: 16,
										"aria-hidden": "true"
									}), "Flight assignments"]
								}), /* @__PURE__ */ jsxs("span", {
									className: "card-sub",
									children: [planFlights.length, " flights in the schedule"]
								})]
							}), /* @__PURE__ */ jsx(DataTable, {
								caption: `Flights assigned to ${plan.id}`,
								columns: flightCols,
								rows: planFlights,
								rowKey: (f) => f.id,
								rowTone: flightRowTone,
								empty: /* @__PURE__ */ jsx(EmptyState, {
									icon: CalendarRange,
									title: "No flights assigned",
									children: "This plan does not yet carry a flight schedule."
								})
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-side",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(TriangleAlert, {
										size: 16,
										"aria-hidden": "true"
									}), "At-risk flights"]
								})
							}), atRiskPlanFlights.length === 0 ? /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx("span", {
									className: "muted",
									style: { fontSize: "var(--fs-md)" },
									children: "No flights in this plan are currently flagged At Risk or No Go."
								})
							}) : /* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: atRiskPlanFlights.map((f) => /* @__PURE__ */ jsxs("div", {
									className: "row-list-item",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "row-main",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-title",
											children: [/* @__PURE__ */ jsx(Link, {
												to: paths.flight(f.id),
												className: "table-link ref",
												children: f.id
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-secondary",
												children: [
													f.origin,
													" → ",
													f.destination
												]
											})]
										}), /* @__PURE__ */ jsx("div", {
											className: "row-sub",
											children: f.riskNote
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "row-end",
										children: /* @__PURE__ */ jsx(RiskBadge, { risk: f.risk })
									})]
								}, f.id))
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(ClipboardCheck, {
										size: 16,
										"aria-hidden": "true"
									}), "Revision history"]
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(Timeline, { events: revisionEvents })
							})]
						}),
						plan.notes && /* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Notes"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "var(--fs-md)",
										color: "var(--text-secondary)"
									},
									children: plan.notes
								})
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/fleet/FleetPlanFormPage.tsx
/**
* Shared plan editor for /fleet/plans/new and /fleet/plans/:id/edit.
* Visual only — nothing is persisted or validated against a backend.
*/
function FleetPlanFormPage({ mode }) {
	const { id = "" } = useParams();
	const plan = mode === "edit" ? getFleetPlan(id) : void 0;
	if (mode === "edit" && !plan) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const title = mode === "new" ? "Create fleet plan" : `Edit ${plan.name}`;
	const flightCols = [
		{
			key: "flight",
			header: "Flight",
			render: (f) => /* @__PURE__ */ jsx("span", {
				className: "ref",
				children: f.id
			})
		},
		{
			key: "route",
			header: "Route",
			render: (f) => /* @__PURE__ */ jsxs("span", {
				className: "nowrap",
				children: [
					f.origin,
					" → ",
					f.destination
				]
			})
		},
		{
			key: "dep",
			header: "Dep time",
			render: (f) => /* @__PURE__ */ jsx("span", {
				className: "nowrap",
				children: fmtTime(f.schedDep)
			})
		},
		{
			key: "assign",
			header: "Assigned aircraft",
			render: (f) => /* @__PURE__ */ jsxs("select", {
				id: `plan-flight-ac-${f.id}`,
				"aria-label": `Assigned aircraft for ${f.id}`,
				defaultValue: f.aircraftId ?? "",
				children: [/* @__PURE__ */ jsx("option", {
					value: "",
					children: "Unassigned"
				}), aircraft.map((a) => /* @__PURE__ */ jsxs("option", {
					value: a.id,
					children: [
						a.registration,
						" — ",
						a.model
					]
				}, a.id))]
			})
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [
					{ label: "Fleet planning" },
					{
						label: "Plans",
						to: paths.fleetPlans
					},
					...mode === "edit" ? [{
						label: plan.id,
						to: paths.fleetPlan(plan.id)
					}] : [],
					{ label: mode === "new" ? "New" : "Edit" }
				],
				title,
				description: mode === "new" ? "Build a new operating plan: select the aircraft in scope, review today’s flight assignments, and publish once conflicts are resolved." : "Update the draft plan. Publishing becomes available once all flagged conflicts are cleared."
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "form-stack",
				onSubmit: (e) => e.preventDefault(),
				"aria-label": title,
				children: [
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
						title: "Plan details",
						hint: "Naming convention: “Week NN Fleet Plan (start–end)”.",
						children: [
							/* @__PURE__ */ jsx(TextField, {
								id: "fp-name",
								label: "Plan name",
								required: true,
								full: true,
								defaultValue: plan?.name,
								placeholder: "Week 32 Fleet Plan (3–9 Aug)"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "fp-start",
								label: "Start date",
								type: "date",
								required: true,
								defaultValue: plan?.startDate
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "fp-end",
								label: "End date",
								type: "date",
								required: true,
								defaultValue: plan?.endDate
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "fp-base",
								label: "Operating base",
								options: [
									"MEL",
									"MQL",
									"ABX"
								],
								defaultValue: plan?.base ?? "MEL"
							}),
							/* @__PURE__ */ jsx(TextAreaField, {
								id: "fp-description",
								label: "Description",
								full: true,
								defaultValue: plan?.description,
								placeholder: "Summarise the operating assumptions for this week — scheduled checks, aircraft in/out of service, charter cover…"
							})
						]
					}) }),
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsx(FormSection, {
						title: "Aircraft selection",
						hint: "Choose the tails in scope for this plan. Availability shown reflects the current fleet position.",
						children: /* @__PURE__ */ jsx("div", {
							className: "field field--full",
							children: /* @__PURE__ */ jsx("div", {
								className: "row-list",
								style: {
									border: "1px solid var(--border)",
									borderRadius: "var(--radius-lg)"
								},
								children: aircraft.map((a) => /* @__PURE__ */ jsx("div", {
									className: "row-list-item",
									children: /* @__PURE__ */ jsx(CheckRow, {
										id: `plan-ac-${a.id}`,
										label: /* @__PURE__ */ jsxs(Fragment$1, { children: [
											/* @__PURE__ */ jsx("span", {
												className: "ref",
												style: { fontWeight: 600 },
												children: a.registration
											}),
											" · ",
											a.model,
											" ·",
											" ",
											/* @__PURE__ */ jsx("span", {
												className: "muted",
												children: a.availability
											})
										] }),
										defaultChecked: mode === "edit" ? plan.aircraftIds.includes(a.id) : a.availability === "Available"
									})
								}, a.id))
							})
						})
					}) }),
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsx(FormSection, {
						title: "Flight assignment",
						hint: "Today's schedule, shown for preview — the full board covers the entire plan window.",
						children: /* @__PURE__ */ jsx("div", {
							className: "field field--full",
							children: /* @__PURE__ */ jsx(DataTable, {
								caption: "Flight assignments for this plan",
								columns: flightCols,
								rows: todaysFlights,
								rowKey: (f) => f.id,
								compact: true
							})
						})
					}) }),
					/* @__PURE__ */ jsxs(FormCard, { children: [/* @__PURE__ */ jsx(FormSection, {
						title: "Notes",
						hint: "Visible to fleet planning and maintenance control on the plan detail page.",
						children: /* @__PURE__ */ jsx(TextAreaField, {
							id: "fp-notes",
							label: "Planning notes",
							full: true,
							defaultValue: plan?.notes,
							placeholder: "Recovery priorities, cover arrangements, anything the next planner should know…"
						})
					}), /* @__PURE__ */ jsxs(FormFooter, {
						note: "Preview only — plans are not persisted.",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: paths.fleetPlans,
								className: "btn btn--ghost",
								children: "Cancel"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn btn--secondary",
								children: "Save draft"
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "btn btn--primary",
								children: [/* @__PURE__ */ jsx(Save, {
									size: 15,
									"aria-hidden": "true"
								}), "Publish plan"]
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ jsxs(Banner, {
				tone: "neutral",
				icon: /* @__PURE__ */ jsx(CalendarRange, {
					size: 15,
					"aria-hidden": "true"
				}),
				children: [
					"In the completed product, publishing recalculates conflicts across the full fleet schedule and writes a",
					" ",
					/* @__PURE__ */ jsx("code", { children: "fleet_plan.publish" }),
					" audit entry."
				]
			})
		]
	});
}
//#endregion
//#region src/pages/fleet/PlannedMaintenancePage.tsx
var GANTT_COLS = 14;
var WINDOW_START = dayIndexOf("2026-07-13");
var TODAY_INDEX = dayIndexOf("2026-07-15");
var GANTT_DAYS = Array.from({ length: GANTT_COLS }, (_, i) => addDays("2026-07-13", i));
/** Day-of-epoch index for an ISO date/date-time string (UTC midnight basis). */
function dayIndexOf(iso) {
	const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
	return Date.UTC(y, m - 1, d) / 864e5;
}
function addDays(iso, days) {
	const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
	const t = Date.UTC(y, m - 1, d) + days * 864e5;
	const date = new Date(t);
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
function dayLabel(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return `${[
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	][new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${d}`;
}
function barTone(e) {
	if (e.status === "In Progress") return "blue";
	if (e.planningRisk === "At Risk") return "red";
	if (e.planningRisk === "Monitor") return "amber";
	return "green";
}
/** Events whose window overlaps the 14-day gantt period at all. */
var ganttEvents = maintenanceEvents.filter((e) => {
	const start = dayIndexOf(e.plannedStart) - WINDOW_START;
	return dayIndexOf(e.plannedEnd) - WINDOW_START >= 0 && start < GANTT_COLS;
});
var inProgressCount = maintenanceEvents.filter((e) => e.status === "In Progress").length;
var next7DaysCount = maintenanceEvents.filter((e) => {
	const idx = dayIndexOf(e.plannedStart) - WINDOW_START;
	return idx >= 2 && idx <= 9 && e.status !== "Completed";
}).length;
var totalScheduled = maintenanceEvents.filter((e) => e.status !== "Completed").length;
function PlannedMaintenancePage() {
	const cols = [
		{
			key: "aircraft",
			header: "Aircraft",
			render: (e) => /* @__PURE__ */ jsx(Link, {
				to: paths.aircraftDetail(e.aircraftId),
				className: "table-link ref",
				children: e.aircraftId
			})
		},
		{
			key: "check",
			header: "Check type",
			render: (e) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
				className: "cell-main",
				children: e.checkType
			}), /* @__PURE__ */ jsx("span", {
				className: "cell-sub",
				children: e.description
			})] })
		},
		{
			key: "start",
			header: "Planned start",
			render: (e) => /* @__PURE__ */ jsx("span", {
				className: "nowrap",
				children: fmtDateTime(e.plannedStart)
			})
		},
		{
			key: "end",
			header: "Planned completion",
			hideMobile: true,
			render: (e) => /* @__PURE__ */ jsx("span", {
				className: "nowrap",
				children: fmtDateTime(e.plannedEnd)
			})
		},
		{
			key: "downtime",
			header: "Est. downtime",
			hideMobile: true,
			render: (e) => Number.isInteger(e.downtimeHours) ? `${e.downtimeHours}h` : fmtDuration(e.downtimeHours * 60)
		},
		{
			key: "facility",
			header: "Facility",
			hideMobile: true,
			render: (e) => e.facility
		},
		{
			key: "risk",
			header: "Planning risk",
			render: (e) => /* @__PURE__ */ jsx(StatusBadge, { status: e.planningRisk })
		},
		{
			key: "wo",
			header: "Work order",
			render: (e) => e.workOrderId ? /* @__PURE__ */ jsx(Link, {
				to: paths.workOrder(e.workOrderId),
				className: "table-link ref",
				children: e.workOrderId
			}) : /* @__PURE__ */ jsx("span", {
				className: "muted",
				children: "—"
			})
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Fleet planning" }, { label: "Planned maintenance" }],
				title: "Planned maintenance",
				description: "Scheduled checks and inspections across the fleet for the next 14 days, with downtime windows plotted against the operating calendar.",
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Wrench, {
						size: 15,
						"aria-hidden": "true"
					}), "Schedule check"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: paths.fleetAvailability,
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(PlaneTakeoff, {
						size: 15,
						"aria-hidden": "true"
					}), "Availability board"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "In progress",
						value: inProgressCount,
						tone: "blue",
						icon: Wrench,
						meta: "VH-MSA A-Check, Hangar 2"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Next 7 days",
						value: next7DaysCount,
						tone: "amber",
						icon: CalendarClock,
						meta: "checks starting 15–22 Jul"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Awaiting parts linkage",
						value: 1,
						tone: "orange",
						icon: PackageSearch,
						meta: "VH-RXT recovery At Risk",
						to: paths.workOrder("WO-2026-0033")
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Total scheduled",
						value: totalScheduled,
						icon: ClipboardCheck,
						meta: "open events across the fleet"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "card-header",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "card-title",
							children: [/* @__PURE__ */ jsx(CalendarClock, {
								size: 16,
								"aria-hidden": "true"
							}), "14-day maintenance timeline"]
						}), /* @__PURE__ */ jsx("span", {
							className: "card-sub",
							children: "Mon 13 Jul – Sun 26 Jul, today highlighted"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "card-body",
						style: { overflowX: "auto" },
						children: /* @__PURE__ */ jsxs("div", {
							className: "gantt",
							style: { ["--gantt-cols"]: GANTT_COLS },
							children: [/* @__PURE__ */ jsxs("div", {
								className: "gantt-header",
								children: [/* @__PURE__ */ jsx("div", {}), GANTT_DAYS.map((d, i) => /* @__PURE__ */ jsx("div", {
									className: "gantt-day",
									"data-today": i === TODAY_INDEX - WINDOW_START ? "true" : void 0,
									children: dayLabel(d)
								}, d))]
							}), ganttEvents.map((e) => {
								const rawStart = dayIndexOf(e.plannedStart) - WINDOW_START;
								const rawEnd = dayIndexOf(e.plannedEnd) - WINDOW_START;
								const clampedStart = Math.max(0, rawStart);
								const clampedEnd = Math.min(GANTT_COLS, Math.max(rawEnd, clampedStart + 1));
								const gridColStart = clampedStart + 2;
								const gridColEnd = clampedEnd + 2;
								return /* @__PURE__ */ jsxs("div", {
									className: "gantt-row",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "gantt-label",
											children: [/* @__PURE__ */ jsx(Link, {
												to: paths.aircraftDetail(e.aircraftId),
												className: "table-link ref cell-main",
												children: e.aircraftId
											}), /* @__PURE__ */ jsx("div", {
												className: "cell-sub",
												children: e.checkType
											})]
										}),
										GANTT_DAYS.map((d, i) => /* @__PURE__ */ jsx("div", {
											className: "gantt-cell",
											"data-today": i === TODAY_INDEX - WINDOW_START ? "true" : void 0,
											style: {
												gridRow: 1,
												gridColumn: i + 2
											}
										}, d)),
										/* @__PURE__ */ jsx("div", {
											className: "gantt-bar",
											"data-tone": barTone(e),
											style: { gridColumn: `${gridColStart} / ${gridColEnd}` },
											children: e.checkType
										})
									]
								}, e.id);
							})]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "card-footer",
						children: "ELT battery replacement (VH-JDF, 28 Jul) and the VH-LWK phase inspection (4 Aug) fall outside this window — see the table below."
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "card-header",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "card-title",
						children: [/* @__PURE__ */ jsx(ClipboardCheck, {
							size: 16,
							"aria-hidden": "true"
						}), "Upcoming checks"]
					}), /* @__PURE__ */ jsx("span", {
						className: "card-sub",
						children: "All scheduled and in-progress maintenance events, ordered by start date"
					})]
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Upcoming and in-progress maintenance events",
					columns: cols,
					rows: upcomingMaintenance,
					rowKey: (e) => e.id,
					rowTone: (e) => e.planningRisk === "At Risk" ? "orange" : void 0
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/aircraft/AircraftListPage.tsx
var TYPE_OPTIONS = [
	"ATR 72-600",
	"DHC-8-315",
	"Saab 340B",
	"King Air 350"
];
var STATUS_OPTIONS$3 = [
	"Serviceable",
	"Unserviceable",
	"Under Maintenance",
	"AOG",
	"Restricted"
];
var BASE_OPTIONS = [
	"MEL",
	"MQL",
	"ABX"
];
function AircraftListPage() {
	const [q, setQ] = useState("");
	const [type, setType] = useState("");
	const [status, setStatus] = useState("");
	const [base, setBase] = useState("");
	const rows = useMemo(() => aircraft.filter((a) => {
		const text = `${a.registration} ${a.manufacturer} ${a.model} ${a.serialNumber}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (type && a.model !== type) return false;
		if (status && a.status !== status) return false;
		if (base && a.base !== base) return false;
		return true;
	}), [
		q,
		type,
		status,
		base
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Maintenance" }, { label: "Aircraft registry" }],
				title: "Aircraft registry",
				description: "Master record for every tail — identity, airworthiness summary and operational availability.",
				actions: /* @__PURE__ */ jsxs(Link, {
					to: paths.aircraftNew,
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Plus, {
						size: 15,
						"aria-hidden": "true"
					}), "Register aircraft"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Fleet size",
						value: fleetSummary.total,
						icon: Plane,
						meta: "4 types · 2 operators"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Serviceable",
						value: aircraft.filter((a) => a.status === "Serviceable").length,
						tone: "green",
						icon: PlaneTakeoff,
						meta: "incl. assigned tails"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "In maintenance",
						value: aircraft.filter((a) => a.status === "Under Maintenance").length,
						tone: "blue",
						icon: Wrench,
						meta: "hangar + awaiting release"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "AOG / unserviceable",
						value: aircraft.filter((a) => a.status === "AOG" || a.status === "Unserviceable").length,
						tone: "red",
						icon: OctagonAlert,
						meta: "VH-RXT · VH-LWK"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search registration, type, serial…",
							value: q,
							onChange: setQ,
							width: 280
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Type",
							allLabel: "All types",
							options: TYPE_OPTIONS,
							value: type,
							onChange: setType
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Status",
							allLabel: "All statuses",
							options: STATUS_OPTIONS$3,
							value: status,
							onChange: setStatus
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Base",
							allLabel: "All bases",
							options: BASE_OPTIONS,
							value: base,
							onChange: setBase
						})
					] })
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Aircraft registry",
					columns: [
						{
							key: "reg",
							header: "Registration",
							render: (a) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
								to: paths.aircraftDetail(a.id),
								className: "table-link ref",
								children: a.registration
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: a.operator
							})] })
						},
						{
							key: "type",
							header: "Manufacturer / model",
							render: (a) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								style: { fontWeight: 550 },
								children: a.model
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: a.manufacturer
							})] })
						},
						{
							key: "sn",
							header: "Serial no.",
							hideMobile: true,
							render: (a) => /* @__PURE__ */ jsx("span", {
								className: "ref",
								children: a.serialNumber
							})
						},
						{
							key: "base",
							header: "Base",
							hideMobile: true,
							render: (a) => a.base
						},
						{
							key: "status",
							header: "Status",
							render: (a) => /* @__PURE__ */ jsx(StatusBadge, { status: a.status })
						},
						{
							key: "availability",
							header: "Availability",
							render: (a) => /* @__PURE__ */ jsx(StatusCell, {
								status: a.availability,
								reason: a.availabilityReason
							})
						},
						{
							key: "hours",
							header: "Hours",
							numeric: true,
							hideMobile: true,
							render: (a) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: fmtNumber(a.totalHours, 1)
							})
						},
						{
							key: "cycles",
							header: "Cycles",
							numeric: true,
							hideMobile: true,
							render: (a) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: fmtNumber(a.totalCycles)
							})
						},
						{
							key: "next-flight",
							header: "Next flight",
							hideMobile: true,
							render: (a) => {
								const f = a.nextFlightId ? getFlight(a.nextFlightId) : void 0;
								if (!f) return /* @__PURE__ */ jsx("span", {
									className: "muted",
									children: "—"
								});
								return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
									to: paths.flight(f.id),
									className: "table-link ref",
									children: f.id
								}), /* @__PURE__ */ jsxs("span", {
									className: "cell-sub",
									children: [
										fmtDayMonth(f.schedDep),
										", ",
										fmtTime(f.schedDep)
									]
								})] });
							}
						},
						{
							key: "next-maint",
							header: "Next maintenance",
							render: (a) => a.nextMaintenance ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								style: { fontWeight: 550 },
								children: a.nextMaintenance.label
							}), /* @__PURE__ */ jsxs("span", {
								className: "cell-sub",
								children: [
									fmtDayMonth(a.nextMaintenance.date),
									", ",
									fmtTime(a.nextMaintenance.date)
								]
							})] }) : /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "—"
							})
						}
					],
					rows,
					rowKey: (a) => a.id,
					rowTone: (a) => a.status === "AOG" ? "red" : a.status === "Unserviceable" ? "orange" : void 0,
					empty: /* @__PURE__ */ jsx(EmptyState, {
						icon: Plane,
						title: "No aircraft match these filters",
						children: "Adjust the search or clear a filter to see the full registry."
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: aircraft.length
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/components/ui/Tabs.tsx
/**
* Accessible tabs: roving arrow-key focus, aria-selected, labelled
* panels. State is local to the page (preview behaviour).
*/
function Tabs({ tabs, initial }) {
	const [active, setActive] = useState(initial ?? tabs[0]?.id ?? "");
	const baseId = useId();
	const refs = useRef([]);
	const onKeyDown = (e, index) => {
		let next = -1;
		if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
		if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
		if (e.key === "Home") next = 0;
		if (e.key === "End") next = tabs.length - 1;
		if (next >= 0) {
			e.preventDefault();
			const tab = tabs[next];
			setActive(tab.id);
			refs.current[next]?.focus();
		}
	};
	const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "tabs",
		role: "tablist",
		children: tabs.map((t, i) => /* @__PURE__ */ jsxs("button", {
			ref: (el) => {
				refs.current[i] = el;
			},
			type: "button",
			role: "tab",
			id: `${baseId}-tab-${t.id}`,
			"aria-selected": t.id === active,
			"aria-controls": `${baseId}-panel-${t.id}`,
			tabIndex: t.id === active ? 0 : -1,
			onClick: () => setActive(t.id),
			onKeyDown: (e) => onKeyDown(e, i),
			children: [t.label, typeof t.count === "number" && /* @__PURE__ */ jsx("span", {
				className: "tab-count",
				children: t.count
			})]
		}, t.id))
	}), activeTab && /* @__PURE__ */ jsx("div", {
		role: "tabpanel",
		id: `${baseId}-panel-${activeTab.id}`,
		"aria-labelledby": `${baseId}-tab-${activeTab.id}`,
		style: { paddingTop: "var(--sp-5)" },
		children: activeTab.content
	})] });
}
//#endregion
//#region src/pages/aircraft/AircraftDetailPage.tsx
function AircraftDetailPage() {
	const { id = "" } = useParams();
	const ac = getAircraft(id);
	if (!ac) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const openDefects = openDefectsForAircraft(ac.id);
	const openWos = openWorkOrdersForAircraft(ac.id);
	const records = recordsForAircraft(ac.id);
	const nextFlight = ac.nextFlightId ? getFlight(ac.nextFlightId) : void 0;
	const timelineEvents = [
		...flightsForAircraft(ac.id).map((f) => ({
			at: f.schedDep,
			title: `Flight ${f.id} — ${f.origin} → ${f.destination}`,
			detail: f.status === "Cancelled" ? `Cancelled — ${f.riskNote ?? ""}` : `Status: ${f.status}`,
			tone: f.status === "Cancelled" ? "red" : "grey",
			refLink: {
				label: f.id,
				to: paths.flight(f.id)
			}
		})),
		...defectsForAircraft(ac.id).map((d) => ({
			at: d.reportedAt,
			title: `Defect reported — ${d.title}`,
			detail: `${d.severity} · ${d.ataChapter}`,
			byUserId: d.reportedByUserId,
			tone: d.severity === "Critical" ? "red" : "blue",
			refLink: {
				label: d.id,
				to: paths.defect(d.id)
			}
		})),
		...workOrdersForAircraft(ac.id).map((w) => ({
			at: w.createdAt,
			title: `Work order raised — ${w.title}`,
			detail: `Priority ${w.priority} · now ${w.status}`,
			byUserId: w.createdByUserId,
			tone: w.priority === "AOG" ? "red" : "blue",
			refLink: {
				label: w.id,
				to: paths.workOrder(w.id)
			}
		})),
		...signOffsForAircraft(ac.id).map((s) => ({
			at: s.signedAt,
			title: `Released to service — ${s.type}`,
			detail: `Certified under licence ${s.licenceNumber}`,
			byUserId: s.signedByUserId,
			tone: "green",
			refLink: {
				label: s.workOrderId,
				to: paths.workOrder(s.workOrderId)
			}
		}))
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(Breadcrumbs, { crumbs: [{
				label: "Aircraft registry",
				to: paths.aircraftList
			}, { label: ac.registration }] }),
			/* @__PURE__ */ jsx(EntityHeader, {
				identIcon: Plane,
				identTone: ac.status === "AOG" ? "red" : void 0,
				title: /* @__PURE__ */ jsx("span", {
					className: "ref",
					children: ac.registration
				}),
				badges: /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx(StatusBadge, { status: ac.status }),
					/* @__PURE__ */ jsx(StatusBadge, { status: ac.availability }),
					/* @__PURE__ */ jsx(RiskBadge, { risk: ac.maintenanceRisk })
				] }),
				subtitle: `${ac.manufacturer} ${ac.model} · ${ac.serialNumber} · built ${ac.yearOfManufacture}`,
				meta: [
					{
						icon: Building2,
						label: "Operator",
						value: ac.operator
					},
					{
						icon: MapPin,
						label: "Location",
						value: ac.location
					},
					{
						icon: Gauge,
						label: "Hours",
						value: fmtNumber(ac.totalHours, 1)
					},
					{
						icon: Route$1,
						label: "Cycles",
						value: fmtNumber(ac.totalCycles)
					}
				],
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(Link, {
					to: paths.aircraftRecords(ac.id),
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(Archive, {
						size: 15,
						"aria-hidden": "true"
					}), "Maintenance records"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: paths.aircraftEdit(ac.id),
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Pencil, {
						size: 15,
						"aria-hidden": "true"
					}), "Edit aircraft"]
				})] })
			}),
			ac.availability === "AOG" && /* @__PURE__ */ jsxs(Banner, {
				tone: "danger",
				children: [
					/* @__PURE__ */ jsx("strong", { children: "Aircraft on ground." }),
					" ",
					ac.availabilityReason,
					" —",
					" ",
					/* @__PURE__ */ jsx(Link, {
						to: paths.workOrder("WO-2026-0033"),
						children: "open recovery work order"
					}),
					"."
				]
			}),
			/* @__PURE__ */ jsx(Tabs, { tabs: [
				{
					id: "summary",
					label: "Summary",
					content: /* @__PURE__ */ jsxs("div", {
						className: "section-stack",
						children: [/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Aircraft summary"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Registration",
										value: /* @__PURE__ */ jsx("span", {
											className: "ref",
											children: ac.registration
										})
									},
									{
										label: "Type",
										value: `${ac.manufacturer} ${ac.model}`
									},
									{
										label: "Serial number",
										value: /* @__PURE__ */ jsx("span", {
											className: "ref",
											children: ac.serialNumber
										})
									},
									{
										label: "Operator",
										value: /* @__PURE__ */ jsx(Link, {
											to: paths.account(ac.accountId),
											children: ac.operator
										})
									},
									{
										label: "Home base",
										value: ac.base
									},
									{
										label: "Status",
										value: /* @__PURE__ */ jsx(StatusBadge, { status: ac.status })
									},
									{
										label: "Availability",
										value: /* @__PURE__ */ jsx(StatusCell, {
											status: ac.availability,
											reason: ac.availabilityReason
										})
									},
									{
										label: "Total hours",
										value: fmtNumber(ac.totalHours, 1)
									},
									{
										label: "Total cycles",
										value: fmtNumber(ac.totalCycles)
									},
									{
										label: "Seats",
										value: ac.seats
									},
									{
										label: "Engines",
										value: ac.engines
									},
									{
										label: "Current flight assignment",
										value: nextFlight ? /* @__PURE__ */ jsxs("span", { children: [
											/* @__PURE__ */ jsx(Link, {
												to: paths.flight(nextFlight.id),
												className: "ref table-link",
												children: nextFlight.id
											}),
											" ",
											nextFlight.origin,
											" → ",
											nextFlight.destination,
											", ",
											fmtDateTime(nextFlight.schedDep)
										] }) : "None"
									},
									{
										label: "Upcoming maintenance",
										value: ac.nextMaintenance ? /* @__PURE__ */ jsxs("span", { children: [
											ac.nextMaintenance.label,
											" · ",
											fmtDateTime(ac.nextMaintenance.date),
											" (",
											/* @__PURE__ */ jsx(Link, {
												to: paths.plannedMaintenance,
												children: "view calendar"
											}),
											")"
										] }) : "None scheduled"
									},
									{
										label: "Configuration",
										value: ac.configurationNotes
									}
								] })
							})]
						}), ac.restrictions.length > 0 && /* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(ShieldAlert, {
										size: 16,
										"aria-hidden": "true"
									}), "Current maintenance restrictions"]
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: ac.restrictions.map((r) => /* @__PURE__ */ jsxs("div", {
									className: "row-list-item",
									children: [/* @__PURE__ */ jsx(TriangleAlert, {
										size: 15,
										"aria-hidden": "true",
										style: {
											color: "var(--tone-amber-dot)",
											flexShrink: 0
										}
									}), /* @__PURE__ */ jsx("span", { children: r })]
								}, r))
							})]
						})]
					})
				},
				{
					id: "open-items",
					label: "Open items",
					count: openDefects.length + openWos.length,
					content: /* @__PURE__ */ jsxs("div", {
						className: "section-stack",
						children: [
							/* @__PURE__ */ jsxs("section", {
								className: "card",
								children: [/* @__PURE__ */ jsx("div", {
									className: "card-header",
									children: /* @__PURE__ */ jsxs("h2", {
										className: "card-title",
										children: [/* @__PURE__ */ jsx(TriangleAlert, {
											size: 16,
											"aria-hidden": "true"
										}), "Open defects"]
									})
								}), /* @__PURE__ */ jsx(DataTable, {
									caption: `Open defects on ${ac.registration}`,
									columns: [
										{
											key: "ref",
											header: "Reference",
											render: (d) => /* @__PURE__ */ jsx(Link, {
												to: paths.defect(d.id),
												className: "table-link ref",
												children: d.id
											})
										},
										{
											key: "title",
											header: "Summary",
											render: (d) => /* @__PURE__ */ jsx("span", {
												className: "cell-main",
												children: d.title
											})
										},
										{
											key: "sev",
											header: "Severity",
											render: (d) => /* @__PURE__ */ jsx(SeverityBadge, { severity: d.severity })
										},
										{
											key: "status",
											header: "Status",
											render: (d) => /* @__PURE__ */ jsx(StatusBadge, { status: d.status })
										},
										{
											key: "wo",
											header: "Work order",
											hideMobile: true,
											render: (d) => d.workOrderId ? /* @__PURE__ */ jsx(Link, {
												to: paths.workOrder(d.workOrderId),
												className: "table-link ref",
												children: d.workOrderId
											}) : /* @__PURE__ */ jsx("span", {
												className: "muted",
												children: "—"
											})
										}
									],
									rows: openDefects,
									rowKey: (d) => d.id,
									empty: /* @__PURE__ */ jsx(EmptyState, {
										icon: TriangleAlert,
										title: "No open defects",
										children: "Nothing outstanding against this aircraft."
									})
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "card",
								children: [/* @__PURE__ */ jsx("div", {
									className: "card-header",
									children: /* @__PURE__ */ jsxs("h2", {
										className: "card-title",
										children: [/* @__PURE__ */ jsx(Wrench, {
											size: 16,
											"aria-hidden": "true"
										}), "Open work orders"]
									})
								}), /* @__PURE__ */ jsx(DataTable, {
									caption: `Open work orders on ${ac.registration}`,
									columns: [
										{
											key: "ref",
											header: "Reference",
											render: (w) => /* @__PURE__ */ jsx(Link, {
												to: paths.workOrder(w.id),
												className: "table-link ref",
												children: w.id
											})
										},
										{
											key: "title",
											header: "Description",
											render: (w) => /* @__PURE__ */ jsx("span", {
												className: "cell-main",
												children: w.title
											})
										},
										{
											key: "priority",
											header: "Priority",
											render: (w) => /* @__PURE__ */ jsx(PriorityBadge, { priority: w.priority })
										},
										{
											key: "status",
											header: "Status",
											render: (w) => /* @__PURE__ */ jsx(StatusBadge, { status: w.status })
										},
										{
											key: "assignee",
											header: "Engineer",
											hideMobile: true,
											render: (w) => shortName(w.assignedToUserId)
										}
									],
									rows: openWos,
									rowKey: (w) => w.id,
									empty: /* @__PURE__ */ jsx(EmptyState, {
										icon: Wrench,
										title: "No open work orders",
										children: "No active maintenance against this aircraft."
									})
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "card",
								children: [/* @__PURE__ */ jsx("div", {
									className: "card-header",
									children: /* @__PURE__ */ jsxs("h2", {
										className: "card-title",
										children: [/* @__PURE__ */ jsx(ShieldAlert, {
											size: 16,
											"aria-hidden": "true"
										}), "Restrictions & required inspections"]
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "row-list",
									children: [ac.restrictions.length === 0 && /* @__PURE__ */ jsx("div", {
										className: "row-list-item muted",
										children: "No active restrictions or outstanding inspections."
									}), ac.restrictions.map((r) => /* @__PURE__ */ jsxs("div", {
										className: "row-list-item",
										children: [/* @__PURE__ */ jsx(TriangleAlert, {
											size: 15,
											"aria-hidden": "true",
											style: {
												color: "var(--tone-amber-dot)",
												flexShrink: 0
											}
										}), /* @__PURE__ */ jsx("span", { children: r })]
									}, r))]
								})]
							})
						]
					})
				},
				{
					id: "timeline",
					label: "Timeline",
					content: /* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "card-header",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "card-title",
								children: [/* @__PURE__ */ jsx(CalendarClock, {
									size: 16,
									"aria-hidden": "true"
								}), "Unified aircraft timeline"]
							}), /* @__PURE__ */ jsx("span", {
								className: "card-sub",
								children: "Flights, defect reports, work orders, sign-offs and status changes — newest first."
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "card-body",
							children: /* @__PURE__ */ jsx(Timeline, { events: timelineEvents })
						})]
					})
				},
				{
					id: "records",
					label: "Maintenance records",
					count: records.length,
					content: /* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "card-header",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "card-title",
								children: [/* @__PURE__ */ jsx(Archive, {
									size: 16,
									"aria-hidden": "true"
								}), "Maintenance records"]
							}), /* @__PURE__ */ jsx("div", {
								className: "card-actions",
								children: /* @__PURE__ */ jsx(Link, {
									to: paths.aircraftRecords(ac.id),
									className: "btn btn--secondary btn--sm",
									children: "Full records view"
								})
							})]
						}), /* @__PURE__ */ jsx(DataTable, {
							caption: `Maintenance records for ${ac.registration}`,
							columns: [
								{
									key: "date",
									header: "Released",
									render: (r) => /* @__PURE__ */ jsx("span", {
										className: "nowrap",
										children: fmtDateTime(r.performedAt)
									})
								},
								{
									key: "type",
									header: "Type",
									render: (r) => /* @__PURE__ */ jsx(StatusBadge, {
										status: r.recordType === "Corrective" ? "In Progress" : "Complete",
										title: r.recordType
									}),
									hideMobile: true
								},
								{
									key: "summary",
									header: "Work performed",
									render: (r) => /* @__PURE__ */ jsx("span", { children: r.summary })
								},
								{
									key: "wo",
									header: "Work order",
									render: (r) => /* @__PURE__ */ jsx(Link, {
										to: paths.workOrder(r.workOrderId),
										className: "table-link ref",
										children: r.workOrderId
									})
								},
								{
									key: "le",
									header: "Licensed engineer",
									hideMobile: true,
									render: (r) => shortName(r.certifiedByUserId)
								},
								{
									key: "ref",
									header: "Reference",
									hideMobile: true,
									render: (r) => /* @__PURE__ */ jsx("span", {
										className: "ref",
										children: r.reference
									})
								}
							],
							rows: records,
							rowKey: (r) => r.id,
							empty: /* @__PURE__ */ jsx(EmptyState, {
								icon: Archive,
								title: "No records yet",
								children: "Completed and certified work will appear here."
							})
						})]
					})
				}
			] })
		]
	});
}
//#endregion
//#region src/pages/aircraft/AircraftFormPage.tsx
/**
* Shared registration form for /aircraft/new and /aircraft/:id/edit.
* Visual only — nothing is persisted. Includes example validation
* styling on the registration field in "new" mode.
*/
function AircraftFormPage({ mode }) {
	const { id = "" } = useParams();
	const ac = mode === "edit" ? getAircraft(id) : void 0;
	if (mode === "edit" && !ac) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const title = mode === "new" ? "Register aircraft" : `Edit ${ac.registration}`;
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [
					{
						label: "Aircraft registry",
						to: paths.aircraftList
					},
					...mode === "edit" ? [{
						label: ac.registration,
						to: paths.aircraftDetail(ac.id)
					}] : [],
					{ label: mode === "new" ? "Register" : "Edit" }
				],
				title,
				description: mode === "new" ? "Add a new tail to the registry. On save the aircraft would be created Serviceable with availability Available." : "Update registry details. Status and availability changes are audited in the full product."
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "form-stack",
				onSubmit: (e) => e.preventDefault(),
				"aria-label": title,
				children: [
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
						title: "Identity",
						hint: "Registration must be unique within the operator account.",
						children: [
							/* @__PURE__ */ jsx(TextField, {
								id: "ac-reg",
								label: "Registration",
								required: true,
								defaultValue: ac?.registration,
								placeholder: "VH-XXX",
								error: mode === "new" ? "Registration is required — example validation state" : void 0
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "ac-serial",
								label: "Serial number",
								required: true,
								defaultValue: ac?.serialNumber,
								placeholder: "MSN 0000"
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "ac-manufacturer",
								label: "Manufacturer",
								required: true,
								options: [
									"ATR",
									"De Havilland Canada",
									"Saab",
									"Beechcraft"
								],
								defaultValue: ac?.manufacturer,
								placeholder: "Select manufacturer"
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "ac-model",
								label: "Model",
								required: true,
								options: [
									"ATR 72-600",
									"DHC-8-315",
									"Saab 340B",
									"King Air 350"
								],
								defaultValue: ac?.model,
								placeholder: "Select model"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "ac-year",
								label: "Year of manufacture",
								type: "number",
								defaultValue: ac ? String(ac.yearOfManufacture) : "",
								placeholder: "2020"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "ac-type-code",
								label: "ICAO type code",
								defaultValue: ac?.typeCode,
								placeholder: "AT76",
								hint: "Used on schedule boards and flight rows."
							})
						]
					}) }),
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
						title: "Operator & base",
						hint: "Links the aircraft to an account for costing and multi-operator support.",
						children: [
							/* @__PURE__ */ jsx(SelectField, {
								id: "ac-operator",
								label: "Operator account",
								required: true,
								options: ["AeroSync Regional Operations (ACC-001)", "Westline Charter Pty Ltd (ACC-002)"],
								defaultValue: ac?.accountId === "ACC-002" ? "Westline Charter Pty Ltd (ACC-002)" : "AeroSync Regional Operations (ACC-001)"
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "ac-base",
								label: "Home base",
								required: true,
								options: [
									"MEL",
									"MQL",
									"ABX",
									"WGA"
								],
								defaultValue: ac?.base
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "ac-status",
								label: "Airworthiness status",
								options: [
									"Serviceable",
									"Unserviceable",
									"Under Maintenance",
									"AOG",
									"Restricted"
								],
								defaultValue: ac?.status ?? "Serviceable",
								hint: "New aircraft start Serviceable / Available."
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "ac-location",
								label: "Current location",
								defaultValue: ac?.location,
								placeholder: "MEL · Bay 12"
							})
						]
					}) }),
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
						title: "Utilisation",
						hint: "Manual entry in this release — flight-log integration is on the roadmap.",
						children: [
							/* @__PURE__ */ jsx(TextField, {
								id: "ac-hours",
								label: "Total flight hours",
								type: "number",
								defaultValue: ac ? String(ac.totalHours) : "",
								placeholder: "0.0"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "ac-cycles",
								label: "Total cycles",
								type: "number",
								defaultValue: ac ? String(ac.totalCycles) : "",
								placeholder: "0"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "ac-seats",
								label: "Seats",
								type: "number",
								defaultValue: ac ? String(ac.seats) : "",
								placeholder: "70"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "ac-engines",
								label: "Engines",
								defaultValue: ac?.engines,
								placeholder: "2 × PW127M"
							})
						]
					}) }),
					/* @__PURE__ */ jsxs(FormCard, { children: [/* @__PURE__ */ jsxs(FormSection, {
						title: "Configuration & documents",
						hint: "Cabin layout, STCs and registration imagery.",
						children: [
							/* @__PURE__ */ jsx(TextAreaField, {
								id: "ac-config",
								label: "Configuration notes",
								full: true,
								defaultValue: ac?.configurationNotes,
								placeholder: "Cabin layout, avionics fit, STC references…"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "field field--full",
								children: [/* @__PURE__ */ jsx("span", {
									className: "field-hint",
									style: {
										fontWeight: 600,
										color: "var(--text-secondary)"
									},
									children: "Registration / livery photo"
								}), /* @__PURE__ */ jsx(AttachmentDropzone, { hint: "Optional livery photo for the registry header — visual preview only" })]
							}),
							/* @__PURE__ */ jsx(CheckRow, {
								id: "ac-archived",
								label: "Archive this aircraft (soft delete — hidden from operational views)",
								defaultChecked: false
							})
						]
					}), /* @__PURE__ */ jsxs(FormFooter, {
						note: "Preview only — nothing is saved or validated against a backend.",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: mode === "edit" ? paths.aircraftDetail(ac.id) : paths.aircraftList,
								className: "btn btn--ghost",
								children: "Cancel"
							}),
							mode === "edit" && /* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "btn btn--danger",
								children: [/* @__PURE__ */ jsx(Archive, {
									size: 15,
									"aria-hidden": "true"
								}), "Archive aircraft"]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "submit",
								className: "btn btn--primary",
								children: [/* @__PURE__ */ jsx(Save, {
									size: 15,
									"aria-hidden": "true"
								}), mode === "new" ? "Register aircraft" : "Save changes"]
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ jsxs(Banner, {
				tone: "neutral",
				children: [
					"In the completed product this form enforces unique registrations, blocks archiving with open work orders, and writes an ",
					/* @__PURE__ */ jsx("code", { children: "aircraft.create" }),
					" / ",
					/* @__PURE__ */ jsx("code", { children: "aircraft.edit" }),
					" audit entry."
				]
			})
		]
	});
}
//#endregion
//#region src/pages/aircraft/AircraftRecordsPage.tsx
/**
* Dedicated maintenance-records view for audit and historical review:
* the certified history of the aircraft with release references.
*/
function AircraftRecordsPage() {
	const { id = "" } = useParams();
	const ac = getAircraft(id);
	if (!ac) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const records = recordsForAircraft(ac.id);
	const releases = signOffsForAircraft(ac.id);
	const totalManhours = records.reduce((s, r) => s + r.totalManhours, 0);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [
					{
						label: "Aircraft registry",
						to: paths.aircraftList
					},
					{
						label: ac.registration,
						to: paths.aircraftDetail(ac.id)
					},
					{ label: "Maintenance records" }
				],
				title: /* @__PURE__ */ jsxs(Fragment$1, { children: ["Maintenance records — ", /* @__PURE__ */ jsx("span", {
					className: "ref",
					children: ac.registration
				})] }),
				description: `Certified maintenance history for ${ac.manufacturer} ${ac.model} ${ac.serialNumber}. Suitable for audit and historical review; every record traces to a work order and release reference.`,
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(Printer, {
						size: 15,
						"aria-hidden": "true"
					}), "Print pack"]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(Download, {
						size: 15,
						"aria-hidden": "true"
					}), "Export history"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Records",
						value: records.length,
						icon: Archive,
						meta: "since onboarding Feb 2026"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Releases",
						value: releases.length,
						tone: "green",
						icon: FileCheck2,
						meta: "all verified in audit"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Certified manhours",
						value: fmtNumber(totalManhours, 1),
						meta: "across all records"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Last release",
						value: records[0] ? fmtDateTime(records[0].performedAt).split(",")[0] : "—",
						meta: records[0] ? `${records[0].reference} · ${userName(records[0].certifiedByUserId)}` : "No releases recorded"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "card-header",
						children: /* @__PURE__ */ jsxs(FilterBar, { children: [
							/* @__PURE__ */ jsx(SearchInput, {
								placeholder: "Search work performed, references…",
								width: 280
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Record type",
								allLabel: "All types",
								options: [
									"Corrective",
									"Inspection",
									"Scheduled"
								]
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Period",
								options: [
									"Last 12 months",
									"Last 6 months",
									"Last 90 days"
								]
							})
						] })
					}),
					/* @__PURE__ */ jsx(DataTable, {
						caption: `Maintenance records for ${ac.registration}`,
						columns: [
							{
								key: "released",
								header: "Released",
								render: (r) => /* @__PURE__ */ jsx("span", {
									className: "nowrap",
									children: fmtDateTime(r.performedAt)
								})
							},
							{
								key: "type",
								header: "Record type",
								render: (r) => /* @__PURE__ */ jsx(StatusBadge, {
									status: r.recordType === "Corrective" ? "In Progress" : "Complete",
									title: r.recordType
								})
							},
							{
								key: "summary",
								header: "Work performed",
								render: (r) => /* @__PURE__ */ jsx("span", { children: r.summary })
							},
							{
								key: "wo",
								header: "Work order",
								render: (r) => /* @__PURE__ */ jsx(Link, {
									to: paths.workOrder(r.workOrderId),
									className: "table-link ref",
									children: r.workOrderId
								})
							},
							{
								key: "defect",
								header: "Defect",
								hideMobile: true,
								render: (r) => r.defectId ? /* @__PURE__ */ jsx(Link, {
									to: paths.defect(r.defectId),
									className: "table-link ref",
									children: r.defectId
								}) : /* @__PURE__ */ jsx("span", {
									className: "muted",
									children: "—"
								})
							},
							{
								key: "performed",
								header: "Performed by",
								hideMobile: true,
								render: (r) => shortName(r.performedByUserId)
							},
							{
								key: "certified",
								header: "Licensed engineer",
								render: (r) => shortName(r.certifiedByUserId)
							},
							{
								key: "hours",
								header: "Manhours",
								numeric: true,
								hideMobile: true,
								render: (r) => /* @__PURE__ */ jsx("span", {
									className: "num",
									children: r.totalManhours.toFixed(1)
								})
							},
							{
								key: "parts",
								header: "Parts used",
								hideMobile: true,
								render: (r) => /* @__PURE__ */ jsx("span", {
									className: "muted",
									children: r.partsUsedSummary
								})
							},
							{
								key: "ref",
								header: "Release ref.",
								render: (r) => /* @__PURE__ */ jsx("span", {
									className: "ref",
									children: r.reference
								})
							}
						],
						rows: records,
						rowKey: (r) => r.id,
						footer: /* @__PURE__ */ jsx(TableFooter, {
							shown: records.length,
							total: records.length
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "card-footer",
						children: "Records are generated automatically at sign-off and are immutable; corrections are issued as new records with an audit note."
					})
				]
			})
		]
	});
}
//#endregion
//#region src/pages/flights/FlightsPage.tsx
var DATE_OPTIONS = [
	"Tue 14 Jul",
	"Wed 15 Jul (today)",
	"Thu 16 Jul"
];
var DATE_BY_OPTION = {
	"Tue 14 Jul": "2026-07-14",
	"Wed 15 Jul (today)": "2026-07-15",
	"Thu 16 Jul": "2026-07-16"
};
var PORT_OPTIONS = [
	"MEL",
	"MQL",
	"ABX",
	"WGA",
	"DBO",
	"BHQ",
	"MGB",
	"GFF"
];
var RISK_OPTIONS = [
	"Clear",
	"Monitor",
	"At Risk",
	"No Go"
];
function FlightsPage() {
	const [date, setDate] = useState("Wed 15 Jul (today)");
	const [q, setQ] = useState("");
	const [dep, setDep] = useState("");
	const [arr, setArr] = useState("");
	const [risk, setRisk] = useState("");
	const rows = useMemo(() => flights.filter((f) => {
		if (date && f.date !== DATE_BY_OPTION[date]) return false;
		if (dep && f.origin !== dep) return false;
		if (arr && f.destination !== arr) return false;
		if (risk && f.risk !== risk) return false;
		if (q) {
			if (!`${f.id} ${f.origin} ${f.destination} ${f.aircraftId ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
		}
		return true;
	}), [
		date,
		q,
		dep,
		arr,
		risk
	]);
	const columns = [
		{
			key: "flight",
			header: "Flight",
			render: (f) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
				to: paths.flight(f.id),
				className: "table-link ref",
				children: f.id
			}), /* @__PURE__ */ jsx("span", {
				className: "cell-sub",
				children: f.captainUserId ? shortName(f.captainUserId) : "Westline crew"
			})] })
		},
		{
			key: "route",
			header: "Route",
			render: (f) => /* @__PURE__ */ jsxs("span", {
				className: "nowrap",
				children: [
					f.origin,
					" → ",
					f.destination
				]
			})
		},
		{
			key: "dep",
			header: "Sched dep",
			render: (f) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
				className: "cell-main num",
				children: fmtTime(f.schedDep)
			}), /* @__PURE__ */ jsx("span", {
				className: "cell-sub",
				children: fmtDayMonth(f.schedDep)
			})] })
		},
		{
			key: "arr",
			header: "Sched arr",
			render: (f) => /* @__PURE__ */ jsx("span", {
				className: "num",
				children: fmtTime(f.schedArr)
			})
		},
		{
			key: "aircraft",
			header: "Aircraft",
			render: (f) => f.aircraftId ? /* @__PURE__ */ jsx(Link, {
				to: paths.aircraftDetail(f.aircraftId),
				className: "chip ref",
				children: f.aircraftId
			}) : /* @__PURE__ */ jsx("span", {
				className: "chip chip--alert",
				children: "Unassigned"
			})
		},
		{
			key: "turnaround",
			header: "Turnaround",
			hideMobile: true,
			render: (f) => f.turnaroundMins ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
				className: "cell-main",
				children: fmtDuration(f.turnaroundMins)
			}), f.nextFlightId && /* @__PURE__ */ jsxs("span", {
				className: "cell-sub",
				children: [
					"Next",
					" ",
					/* @__PURE__ */ jsx(Link, {
						to: paths.flight(f.nextFlightId),
						className: "ref",
						children: f.nextFlightId
					})
				]
			})] }) : /* @__PURE__ */ jsx("span", {
				className: "muted",
				children: "—"
			})
		},
		{
			key: "risk",
			header: "Maint. risk",
			render: (f) => /* @__PURE__ */ jsx(RiskBadge, { risk: f.risk })
		},
		{
			key: "status",
			header: "Status",
			render: (f) => /* @__PURE__ */ jsx(StatusBadge, { status: f.status })
		},
		{
			key: "defects",
			header: "Open defects",
			numeric: true,
			render: (f) => {
				if (!f.aircraftId) return /* @__PURE__ */ jsx("span", {
					className: "muted",
					children: "—"
				});
				const n = openDefectCount(f.aircraftId);
				return n > 0 ? /* @__PURE__ */ jsxs(Link, {
					to: paths.aircraftDetail(f.aircraftId),
					className: "chip",
					children: [n, " open"]
				}) : /* @__PURE__ */ jsx("span", {
					className: "muted",
					children: "0"
				});
			}
		}
	];
	const rowTone = (f) => {
		if (f.risk === "No Go") return "red";
		if (f.risk === "At Risk") return "orange";
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			crumbs: [{ label: "Operations" }, { label: "Flights" }],
			title: "Flights",
			description: "Regional network schedule with live maintenance risk, aircraft assignment and turnaround detail for every departure.",
			actions: /* @__PURE__ */ jsxs(Link, {
				to: paths.flightNew,
				className: "btn btn--primary",
				children: [/* @__PURE__ */ jsx(Plus, {
					size: 15,
					"aria-hidden": "true"
				}), "Create flight"]
			})
		}), /* @__PURE__ */ jsxs("section", {
			className: "card",
			children: [/* @__PURE__ */ jsx("div", {
				className: "card-header",
				children: /* @__PURE__ */ jsxs(FilterBar, { children: [
					/* @__PURE__ */ jsx(SelectFilter, {
						label: "Date",
						options: DATE_OPTIONS,
						value: date,
						onChange: setDate
					}),
					/* @__PURE__ */ jsx(SearchInput, {
						placeholder: "Search flight, port, aircraft…",
						value: q,
						onChange: setQ,
						width: 240
					}),
					/* @__PURE__ */ jsx(SelectFilter, {
						label: "Departure",
						allLabel: "Any departure",
						options: PORT_OPTIONS,
						value: dep,
						onChange: setDep
					}),
					/* @__PURE__ */ jsx(SelectFilter, {
						label: "Arrival",
						allLabel: "Any arrival",
						options: PORT_OPTIONS,
						value: arr,
						onChange: setArr
					}),
					/* @__PURE__ */ jsx(SelectFilter, {
						label: "Risk",
						allLabel: "Any risk",
						options: RISK_OPTIONS,
						value: risk,
						onChange: setRisk
					})
				] })
			}), /* @__PURE__ */ jsx(DataTable, {
				caption: "Flight schedule",
				columns,
				rows,
				rowKey: (f) => f.id,
				rowTone,
				empty: /* @__PURE__ */ jsx(EmptyState, {
					icon: CalendarDays,
					title: "No flights match these filters",
					children: "Adjust the date, ports or risk filter to see more of the schedule."
				}),
				footer: /* @__PURE__ */ jsx(TableFooter, {
					shown: rows.length,
					total: flights.length
				})
			})]
		})]
	});
}
//#endregion
//#region src/components/ui/Avatar.tsx
function Avatar({ name, size }) {
	return /* @__PURE__ */ jsx("span", {
		className: `avatar${size ? ` avatar--${size}` : ""}`,
		"data-hue": avatarHue(name),
		"aria-hidden": "true",
		children: initials(name)
	});
}
/** Avatar + name (+ role) cell, optionally linking to the admin user page. */
function UserChip({ userId, sub, link, size }) {
	const user = userId ? getUser(userId) : void 0;
	if (!user) return /* @__PURE__ */ jsx("span", {
		className: "muted",
		children: "Unassigned"
	});
	const name = link ? /* @__PURE__ */ jsx(Link, {
		to: paths.adminUser(user.id),
		className: "table-link",
		children: user.name
	}) : user.name;
	return /* @__PURE__ */ jsxs("span", {
		className: "user-cell",
		children: [/* @__PURE__ */ jsx(Avatar, {
			name: user.name,
			size
		}), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
			className: "user-cell-name",
			children: name
		}), sub !== "" && /* @__PURE__ */ jsx("span", {
			className: "user-cell-sub",
			style: { display: "block" },
			children: sub ?? user.role
		})] })]
	});
}
//#endregion
//#region src/pages/flights/FlightDetailPage.tsx
var RISK_RULES = [
	{
		rule: "No open defects on the assigned aircraft",
		result: "Clear"
	},
	{
		rule: "Deferred minor defect, reinspection current",
		result: "Monitor"
	},
	{
		rule: "Defect under review, or a work order in progress",
		result: "At Risk"
	},
	{
		rule: "Aircraft AOG, or an open critical defect",
		result: "No Go"
	}
];
function FlightDetailPage() {
	const { id = "" } = useParams();
	const f = getFlight(id);
	if (!f) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const ac = f.aircraftId ? getAircraft(f.aircraftId) : void 0;
	const openDefects = f.aircraftId ? openDefectsForAircraft(f.aircraftId) : [];
	const openWos = f.aircraftId ? openWorkOrdersForAircraft(f.aircraftId) : [];
	const untilDep = minutesBetween(NOW, f.schedDep);
	const countdownLabel = f.status === "Completed" ? "Completed" : f.status === "Cancelled" ? "Cancelled" : untilDep > 0 ? `Departs in ${fmtDuration(untilDep)}` : `Departed ${fmtDuration(-untilDep)} ago`;
	const defectCols = [
		{
			key: "ref",
			header: "Reference",
			render: (d) => /* @__PURE__ */ jsx(Link, {
				to: paths.defect(d.id),
				className: "table-link ref",
				children: d.id
			})
		},
		{
			key: "title",
			header: "Title",
			render: (d) => /* @__PURE__ */ jsx("span", {
				className: "cell-main",
				children: d.title
			})
		},
		{
			key: "sev",
			header: "Severity",
			render: (d) => /* @__PURE__ */ jsx(SeverityBadge, { severity: d.severity })
		},
		{
			key: "status",
			header: "Status",
			render: (d) => /* @__PURE__ */ jsx(StatusBadge, { status: d.status })
		}
	];
	const woCols = [
		{
			key: "ref",
			header: "Reference",
			render: (w) => /* @__PURE__ */ jsx(Link, {
				to: paths.workOrder(w.id),
				className: "table-link ref",
				children: w.id
			})
		},
		{
			key: "title",
			header: "Title",
			render: (w) => /* @__PURE__ */ jsx("span", {
				className: "cell-main",
				children: w.title
			})
		},
		{
			key: "priority",
			header: "Priority",
			render: (w) => /* @__PURE__ */ jsx(PriorityBadge, { priority: w.priority })
		},
		{
			key: "status",
			header: "Status",
			render: (w) => /* @__PURE__ */ jsx(StatusBadge, { status: w.status })
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(Breadcrumbs, { crumbs: [
				{ label: "Operations" },
				{
					label: "Flights",
					to: paths.flights
				},
				{ label: f.id }
			] }),
			/* @__PURE__ */ jsx(EntityHeader, {
				identIcon: Route$1,
				identTone: f.risk === "No Go" ? "red" : void 0,
				title: /* @__PURE__ */ jsx("span", {
					className: "ref",
					children: f.id
				}),
				badges: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(StatusBadge, { status: f.status }), /* @__PURE__ */ jsx(RiskBadge, { risk: f.risk })] }),
				subtitle: `${f.origin} → ${f.destination} · ${fmtWeekday(f.date)}`,
				meta: [
					{
						label: "Sched dep",
						value: fmtDateTime(f.schedDep)
					},
					{
						label: "Sched arr",
						value: fmtDateTime(f.schedArr)
					},
					{
						label: "Aircraft",
						value: ac ? /* @__PURE__ */ jsx(Link, {
							to: paths.aircraftDetail(ac.id),
							className: "ref table-link",
							children: ac.registration
						}) : "Unassigned"
					},
					...f.planId ? [{
						label: "Plan",
						value: /* @__PURE__ */ jsx(Link, {
							to: paths.fleetPlan(f.planId),
							className: "ref table-link",
							children: f.planId
						})
					}] : []
				],
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [f.aircraftId && /* @__PURE__ */ jsxs(Link, {
					to: paths.aircraftDetail(f.aircraftId),
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(PlaneTakeoff, {
						size: 15,
						"aria-hidden": "true"
					}), "View aircraft"]
				}), f.planId && /* @__PURE__ */ jsxs(Link, {
					to: paths.fleetPlan(f.planId),
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(CalendarRange, {
						size: 15,
						"aria-hidden": "true"
					}), "Fleet plan"]
				})] })
			}),
			(f.risk === "No Go" || f.risk === "At Risk") && f.riskNote && /* @__PURE__ */ jsxs(Banner, {
				tone: f.risk === "No Go" ? "danger" : "warn",
				children: [/* @__PURE__ */ jsx("strong", { children: f.risk === "No Go" ? "Flight blocked. " : "At-risk flight. " }), f.riskNote]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "two-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "col-main",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(PlaneTakeoff, {
										size: 16,
										"aria-hidden": "true"
									}), "Turnaround"]
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "metric-card",
									style: {
										boxShadow: "none",
										border: "none",
										padding: 0,
										marginBottom: "var(--sp-4)"
									},
									children: [/* @__PURE__ */ jsx("span", {
										className: "metric-label",
										children: "Status"
									}), /* @__PURE__ */ jsx("span", {
										className: "metric-value",
										children: countdownLabel
									})]
								}), /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Turnaround window",
										value: f.turnaroundMins ? fmtDuration(f.turnaroundMins) : "—"
									},
									{
										label: "Maintenance window",
										value: f.maintenanceWindow ? `${fmtTime(f.maintenanceWindow.start)} – ${fmtTime(f.maintenanceWindow.end)}` : "—"
									},
									{
										label: "Next rotation",
										value: f.nextFlightId ? /* @__PURE__ */ jsx(Link, {
											to: paths.flight(f.nextFlightId),
											className: "ref table-link",
											children: f.nextFlightId
										}) : "—"
									},
									{
										label: "Gate / stand",
										value: ac?.location ?? "—"
									}
								] })]
							})]
						}),
						ac && /* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "card-header",
									children: [/* @__PURE__ */ jsxs("h2", {
										className: "card-title",
										children: [/* @__PURE__ */ jsx(ShieldAlert, {
											size: 16,
											"aria-hidden": "true"
										}), "Aircraft status & restrictions"]
									}), /* @__PURE__ */ jsx("div", {
										className: "card-actions",
										children: /* @__PURE__ */ jsx(Link, {
											to: paths.aircraftDetail(ac.id),
											className: "btn btn--ghost btn--sm",
											children: "Full aircraft record"
										})
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "card-body",
									children: /* @__PURE__ */ jsx(StatusCell, {
										status: ac.availability,
										reason: ac.availabilityReason
									})
								}),
								ac.restrictions.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "row-list",
									children: ac.restrictions.map((r) => /* @__PURE__ */ jsxs("div", {
										className: "row-list-item",
										children: [/* @__PURE__ */ jsx(TriangleAlert, {
											size: 15,
											"aria-hidden": "true",
											style: {
												color: "var(--tone-amber-dot)",
												flexShrink: 0
											}
										}), /* @__PURE__ */ jsx("span", { children: r })]
									}, r))
								})
							]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(TriangleAlert, {
										size: 16,
										"aria-hidden": "true"
									}), "Open defects on aircraft"]
								})
							}), /* @__PURE__ */ jsx(DataTable, {
								caption: `Open defects on ${ac?.registration ?? "assigned aircraft"}`,
								columns: defectCols,
								rows: openDefects,
								rowKey: (d) => d.id,
								empty: /* @__PURE__ */ jsx(EmptyState, {
									icon: TriangleAlert,
									title: "No open defects",
									children: ac ? `Nothing outstanding against ${ac.registration}.` : "No aircraft is assigned to this flight yet."
								})
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(Wrench, {
										size: 16,
										"aria-hidden": "true"
									}), "Open work orders"]
								})
							}), /* @__PURE__ */ jsx(DataTable, {
								caption: `Open work orders on ${ac?.registration ?? "assigned aircraft"}`,
								columns: woCols,
								rows: openWos,
								rowKey: (w) => w.id,
								empty: /* @__PURE__ */ jsx(EmptyState, {
									icon: Wrench,
									title: "No open work orders",
									children: ac ? `No active maintenance against ${ac.registration}.` : "No aircraft is assigned to this flight yet."
								})
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(Route$1, {
										size: 16,
										"aria-hidden": "true"
									}), "Turnaround events"]
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: f.events && f.events.length > 0 ? /* @__PURE__ */ jsx(Timeline, { events: f.events }) : /* @__PURE__ */ jsx(EmptyState, {
									icon: Route$1,
									title: "No turnaround events logged",
									children: "Ground handling and dispatch events for this flight have not been recorded yet."
								})
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-side",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Crew"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "row-list",
								children: [/* @__PURE__ */ jsx("div", {
									className: "row-list-item",
									children: /* @__PURE__ */ jsx(UserChip, {
										userId: f.captainUserId,
										sub: "Captain",
										link: true
									})
								}), /* @__PURE__ */ jsx("div", {
									className: "row-list-item",
									children: /* @__PURE__ */ jsxs("span", {
										className: "user-cell",
										children: [/* @__PURE__ */ jsx(Avatar, { name: f.firstOfficer ?? "Unassigned" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
											className: "user-cell-name",
											children: f.firstOfficer ?? "Unassigned"
										}), /* @__PURE__ */ jsx("span", {
											className: "user-cell-sub",
											style: { display: "block" },
											children: "First officer"
										})] })]
									})
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsxs("h2", {
									className: "card-title",
									children: [/* @__PURE__ */ jsx(MapPin, {
										size: 16,
										"aria-hidden": "true"
									}), "Maintenance controller notes"]
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: f.controllerNotes ? /* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "var(--fs-md)",
										color: "var(--text-secondary)"
									},
									children: f.controllerNotes
								}) : /* @__PURE__ */ jsx("span", {
									className: "muted",
									style: { fontSize: "var(--fs-md)" },
									children: "No controller notes on this flight."
								})
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Risk assessment"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								children: [
									/* @__PURE__ */ jsx("div", {
										style: { marginBottom: "var(--sp-3)" },
										children: /* @__PURE__ */ jsx(RiskBadge, { risk: f.risk })
									}),
									f.riskNote && /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "var(--fs-md)",
											color: "var(--text-secondary)",
											marginBottom: "var(--sp-4)"
										},
										children: f.riskNote
									}),
									/* @__PURE__ */ jsx("div", {
										className: "row-list",
										style: {
											border: "1px solid var(--border)",
											borderRadius: "var(--radius-lg)"
										},
										children: RISK_RULES.map((r) => /* @__PURE__ */ jsxs("div", {
											className: "row-list-item",
											style: { fontWeight: r.result === f.risk ? 600 : void 0 },
											children: [/* @__PURE__ */ jsxs("span", {
												className: "row-main",
												style: { fontSize: "var(--fs-sm)" },
												children: [
													r.rule,
													" → ",
													r.result
												]
											}), r.result === f.risk && /* @__PURE__ */ jsx("span", {
												className: "chip",
												children: "active"
											})]
										}, r.rule))
									})
								]
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/flights/FlightFormPage.tsx
var PORTS = [
	"MEL",
	"MQL",
	"ABX",
	"WGA",
	"DBO",
	"BHQ",
	"MGB",
	"GFF"
];
function FlightFormPage() {
	const availableAircraftOptions = aircraft.filter((a) => a.availability === "Available").map((a) => `${a.registration} — ${a.model} (Available)`);
	const planOptions = fleetPlans.map((p) => p.name);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [
					{ label: "Operations" },
					{
						label: "Flights",
						to: paths.flights
					},
					{ label: "New" }
				],
				title: "Create flight",
				description: "Add a flight to the regional schedule. Aircraft assignment can be left open and completed later from the availability board."
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "form-stack",
				onSubmit: (e) => e.preventDefault(),
				"aria-label": "Create flight",
				children: [
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
						title: "Schedule",
						hint: "Flight numbers follow the ASR-NNN convention.",
						children: [
							/* @__PURE__ */ jsx(TextField, {
								id: "fl-number",
								label: "Flight number",
								required: true,
								placeholder: "ASR-XXX"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "fl-date",
								label: "Date",
								type: "date",
								required: true,
								defaultValue: "2026-07-16"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "fl-dep-time",
								label: "Scheduled departure",
								type: "time",
								required: true
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "fl-arr-time",
								label: "Scheduled arrival",
								type: "time",
								required: true
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "fl-origin",
								label: "Origin",
								required: true,
								options: PORTS,
								defaultValue: "MEL"
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "fl-destination",
								label: "Destination",
								required: true,
								options: PORTS,
								placeholder: "Select destination"
							})
						]
					}) }),
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
						title: "Aircraft assignment",
						hint: "Only aircraft currently Available are listed. Assigning a restricted or AOG tail is blocked in the full product until it is released.",
						children: [/* @__PURE__ */ jsx(SelectField, {
							id: "fl-aircraft",
							label: "Aircraft",
							options: availableAircraftOptions,
							placeholder: "Assign later",
							full: true,
							hint: "Availability is checked against the fleet position at save time."
						}), /* @__PURE__ */ jsx(SelectField, {
							id: "fl-plan",
							label: "Fleet plan",
							options: planOptions,
							defaultValue: "Week 29 Fleet Plan (13–19 Jul)",
							full: true
						})]
					}) }),
					/* @__PURE__ */ jsxs(FormCard, { children: [/* @__PURE__ */ jsxs(FormSection, {
						title: "Turnaround",
						hint: "Used to plan ground handling and the maintenance window between rotations.",
						children: [/* @__PURE__ */ jsx(TextField, {
							id: "fl-turnaround",
							label: "Turnaround minutes",
							type: "number",
							placeholder: "35"
						}), /* @__PURE__ */ jsx(TextField, {
							id: "fl-maint-window",
							label: "Maintenance window notes",
							full: true,
							placeholder: "e.g. weekly check prep, defect reinspection, fuel uplift constraints…"
						})]
					}), /* @__PURE__ */ jsxs(FormFooter, {
						note: "Preview only — nothing is saved or validated against a backend.",
						children: [/* @__PURE__ */ jsx(Link, {
							to: paths.flights,
							className: "btn btn--ghost",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							className: "btn btn--primary",
							children: [/* @__PURE__ */ jsx(Save, {
								size: 15,
								"aria-hidden": "true"
							}), "Create flight"]
						})]
					})] })
				]
			}),
			/* @__PURE__ */ jsxs(Banner, {
				tone: "neutral",
				icon: /* @__PURE__ */ jsx(PlaneTakeoff, {
					size: 15,
					"aria-hidden": "true"
				}),
				children: [
					"In the completed product this form validates aircraft availability against the fleet plan and writes a",
					" ",
					/* @__PURE__ */ jsx("code", { children: "flight.create" }),
					" audit entry."
				]
			})
		]
	});
}
//#endregion
//#region src/pages/defects/DefectsPage.tsx
var STATUS_OPTIONS$2 = [
	"Reported",
	"Under Review",
	"Deferred",
	"Work Order Created",
	"Rectified",
	"Closed",
	"Cancelled"
];
var SEVERITY_OPTIONS = [
	"Minor",
	"Significant",
	"Critical"
];
var AIRCRAFT_OPTIONS$3 = [...new Set(defects.map((d) => d.aircraftId))].sort();
var SOURCE_OPTIONS = [
	"Pilot Report",
	"Line Inspection",
	"Scheduled Check",
	"Cabin Crew"
];
var deferredCount = defects.filter((d) => d.status === "Deferred").length;
var closedThisMonthCount = defects.filter((d) => d.status === "Closed" && d.closedAt?.startsWith("2026-07")).length;
function DefectsPage() {
	const [q, setQ] = useState("");
	const [status, setStatus] = useState("");
	const [severity, setSeverity] = useState("");
	const [aircraft, setAircraft] = useState("");
	const [source, setSource] = useState("");
	const rows = useMemo(() => [...defects].filter((d) => {
		const text = `${d.id} ${d.title} ${d.aircraftId}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (status && d.status !== status) return false;
		if (severity && d.severity !== severity) return false;
		if (aircraft && d.aircraftId !== aircraft) return false;
		if (source && d.source !== source) return false;
		return true;
	}).sort((a, b) => b.reportedAt.localeCompare(a.reportedAt)), [
		q,
		status,
		severity,
		aircraft,
		source
	]);
	const columns = [
		{
			key: "ref",
			header: "Reference",
			render: (d) => /* @__PURE__ */ jsx(Link, {
				to: paths.defect(d.id),
				className: "table-link ref",
				children: d.id
			})
		},
		{
			key: "aircraft",
			header: "Aircraft",
			render: (d) => /* @__PURE__ */ jsx(Link, {
				to: paths.aircraftDetail(d.aircraftId),
				className: "chip ref",
				children: d.aircraftId
			})
		},
		{
			key: "flight",
			header: "Flight",
			hideMobile: true,
			render: (d) => d.flightId ? /* @__PURE__ */ jsx(Link, {
				to: paths.flight(d.flightId),
				className: "table-link ref",
				children: d.flightId
			}) : /* @__PURE__ */ jsx("span", {
				className: "muted",
				children: "—"
			})
		},
		{
			key: "ata",
			header: "ATA",
			hideMobile: true,
			render: (d) => /* @__PURE__ */ jsx("span", { children: d.ataChapter })
		},
		{
			key: "summary",
			header: "Summary",
			render: (d) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
				className: "cell-main",
				children: d.title
			}), /* @__PURE__ */ jsx("span", {
				className: "cell-sub",
				children: d.description
			})] })
		},
		{
			key: "severity",
			header: "Severity",
			render: (d) => /* @__PURE__ */ jsx(SeverityBadge, { severity: d.severity })
		},
		{
			key: "status",
			header: "Status",
			render: (d) => /* @__PURE__ */ jsx(StatusBadge, { status: d.status })
		},
		{
			key: "reporter",
			header: "Reported by",
			hideMobile: true,
			render: (d) => shortName(d.reportedByUserId)
		},
		{
			key: "reported",
			header: "Reported",
			hideMobile: true,
			render: (d) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
				className: "nowrap",
				children: fmtDateTime(d.reportedAt)
			}), /* @__PURE__ */ jsx("span", {
				className: "cell-sub",
				children: fmtRelative(d.reportedAt)
			})] })
		},
		{
			key: "wo",
			header: "Work order",
			render: (d) => d.workOrderId ? /* @__PURE__ */ jsx(Link, {
				to: paths.workOrder(d.workOrderId),
				className: "table-link ref",
				children: d.workOrderId
			}) : /* @__PURE__ */ jsx("span", {
				className: "muted",
				children: "—"
			})
		}
	];
	const isOpen = (d) => d.status !== "Closed" && d.status !== "Cancelled";
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Operations" }, { label: "Defects" }],
				title: "Defects",
				description: "Every defect reported across the fleet — pilot reports, line inspection findings, cabin crew logs and scheduled-check discoveries.",
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(Link, {
					to: paths.defectReview,
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(Inbox, {
						size: 15,
						"aria-hidden": "true"
					}), "Review queue"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: paths.defectNew,
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Plus, {
						size: 15,
						"aria-hidden": "true"
					}), "Report defect"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Open defects",
						value: openDefects.length,
						tone: "blue"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Awaiting review",
						value: reviewQueueDefects.length,
						tone: "blue",
						to: paths.defectReview
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Critical",
						value: defectSeverityBreakdown.critical,
						tone: "red"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Deferred",
						value: deferredCount,
						tone: "amber"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Closed this month",
						value: closedThisMonthCount,
						tone: "green"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search reference, title, aircraft…",
							value: q,
							onChange: setQ,
							width: 260
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Status",
							allLabel: "All statuses",
							options: STATUS_OPTIONS$2,
							value: status,
							onChange: setStatus
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Severity",
							allLabel: "All severities",
							options: SEVERITY_OPTIONS,
							value: severity,
							onChange: setSeverity
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Aircraft",
							allLabel: "All aircraft",
							options: AIRCRAFT_OPTIONS$3,
							value: aircraft,
							onChange: setAircraft
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Source",
							allLabel: "All sources",
							options: SOURCE_OPTIONS,
							value: source,
							onChange: setSource
						})
					] })
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Defect log",
					columns,
					rows,
					rowKey: (d) => d.id,
					rowTone: (d) => isOpen(d) && d.severity === "Critical" ? "red" : isOpen(d) && d.severity === "Significant" ? "orange" : void 0,
					empty: /* @__PURE__ */ jsx(EmptyState, {
						icon: TriangleAlert,
						title: "No defects match these filters",
						children: "Adjust the search or clear a filter to see the rest of the log."
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: defects.length
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/defects/DefectDetailPage.tsx
function DefectDetailPage() {
	const { id = "" } = useParams();
	const d = getDefect(id);
	if (!d) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const linkedWo = d.workOrderId ? getWorkOrder(d.workOrderId) : void 0;
	const ac = getAircraft(d.aircraftId);
	const contextualActions = (() => {
		switch (d.status) {
			case "Reported": return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn--primary",
				children: "Start review"
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn--danger",
				children: "Cancel defect"
			})] });
			case "Under Review": return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn--secondary",
				children: "Defer"
			}), /* @__PURE__ */ jsx(Link, {
				to: paths.workOrderNew,
				className: "btn btn--primary",
				children: "Create work order"
			})] });
			case "Deferred": return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
				to: paths.workOrderNew,
				className: "btn btn--primary",
				children: "Create work order"
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn--secondary",
				children: "Close defect"
			})] });
			case "Work Order Created":
			case "Rectified": return d.workOrderId ? /* @__PURE__ */ jsx(Link, {
				to: paths.workOrder(d.workOrderId),
				className: "btn btn--primary",
				children: "Open work order"
			}) : null;
			case "Closed": return /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn--secondary",
				children: "Reopen (admin)"
			});
			default: return null;
		}
	})();
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(Breadcrumbs, { crumbs: [{
				label: "Defects",
				to: paths.defects
			}, { label: d.id }] }),
			/* @__PURE__ */ jsx(EntityHeader, {
				identIcon: TriangleAlert,
				identTone: d.severity === "Critical" ? "red" : void 0,
				title: /* @__PURE__ */ jsx("span", {
					className: "ref",
					children: d.id
				}),
				badges: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(SeverityBadge, { severity: d.severity }), /* @__PURE__ */ jsx(StatusBadge, { status: d.status })] }),
				subtitle: d.title,
				meta: [
					{
						label: "Aircraft",
						value: /* @__PURE__ */ jsx(Link, {
							to: paths.aircraftDetail(d.aircraftId),
							children: d.aircraftId
						})
					},
					...d.flightId ? [{
						label: "Flight",
						value: /* @__PURE__ */ jsx(Link, {
							to: paths.flight(d.flightId),
							children: d.flightId
						})
					}] : [],
					{
						label: "ATA chapter",
						value: d.ataChapter
					},
					{
						label: "Reported",
						value: fmtDateTimeFull(d.reportedAt)
					},
					{
						label: "Reporter",
						value: userName(d.reportedByUserId)
					}
				],
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [contextualActions, /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--ghost",
					children: [/* @__PURE__ */ jsx(Paperclip, {
						size: 15,
						"aria-hidden": "true"
					}), "Add attachment"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "two-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "col-main",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Description"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								children: [/* @__PURE__ */ jsx("p", {
									style: { marginBottom: 14 },
									children: d.description
								}), /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Location on aircraft",
										value: d.locationOnAircraft
									},
									{
										label: "Reported location",
										value: d.reportedLocation
									},
									{
										label: "Category",
										value: d.category
									},
									{
										label: "Source",
										value: d.source
									},
									{
										label: "Severity",
										value: /* @__PURE__ */ jsx(SeverityBadge, { severity: d.severity })
									},
									{
										label: "Availability impact",
										value: d.availabilityImpact
									},
									{
										label: "Flight impact",
										value: d.flightImpact ?? "Nil"
									}
								] })]
							})]
						}),
						d.deferral && /* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Deferral"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 14
								},
								children: [/* @__PURE__ */ jsx(Banner, {
									tone: "warn",
									children: d.deferral.reason
								}), /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Deferred until",
										value: fmtDate(d.deferral.until)
									},
									{
										label: "Reference",
										value: /* @__PURE__ */ jsx("span", {
											className: "ref",
											children: d.deferral.reference
										})
									},
									{
										label: "Approved by",
										value: userName(d.deferral.approvedByUserId)
									}
								] })]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Attachments"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 14
								},
								children: [/* @__PURE__ */ jsx(AttachmentGrid, { attachments: d.attachments }), /* @__PURE__ */ jsx(AttachmentDropzone, { hint: "Photos of the finding — visual preview only, files are not uploaded" })]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Status timeline"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(Timeline, { events: d.timeline })
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-side",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Review"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 10
								},
								children: [d.reviewNotes ? /* @__PURE__ */ jsx("p", { children: d.reviewNotes }) : /* @__PURE__ */ jsx("p", {
									className: "muted",
									children: "Not yet reviewed"
								}), d.reviewedByUserId && /* @__PURE__ */ jsx(UserChip, {
									userId: d.reviewedByUserId,
									sub: "Reviewer"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Linked work order"
								})
							}), linkedWo ? /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 10
								},
								children: [
									/* @__PURE__ */ jsx(Link, {
										to: paths.workOrder(linkedWo.id),
										className: "table-link ref",
										style: { fontSize: "var(--fs-base)" },
										children: linkedWo.id
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: 8,
											flexWrap: "wrap"
										},
										children: [/* @__PURE__ */ jsx(StatusBadge, { status: linkedWo.status }), /* @__PURE__ */ jsx(PriorityBadge, { priority: linkedWo.priority })]
									}),
									/* @__PURE__ */ jsx(UserChip, {
										userId: linkedWo.assignedToUserId,
										sub: "Assigned engineer"
									})
								]
							}) : /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(EmptyState, {
									icon: Wrench,
									title: "No work order yet",
									action: (d.status === "Reported" || d.status === "Under Review" || d.status === "Deferred") && /* @__PURE__ */ jsx(Link, {
										to: paths.workOrderNew,
										className: "btn btn--secondary btn--sm",
										children: "Create work order"
									}),
									children: "Raise a work order to schedule rectification against this defect."
								})
							})]
						}),
						ac && /* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Aircraft context"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 12
								},
								children: [
									/* @__PURE__ */ jsx(StatusCell, {
										status: ac.availability,
										reason: ac.availabilityReason
									}),
									/* @__PURE__ */ jsx(DetailGrid, { items: [{
										label: "Maintenance risk",
										value: /* @__PURE__ */ jsx(RiskBadge, { risk: ac.maintenanceRisk })
									}] }),
									/* @__PURE__ */ jsxs(Link, {
										to: paths.aircraftDetail(ac.id),
										className: "btn btn--secondary btn--sm",
										style: { alignSelf: "flex-start" },
										children: ["View ", ac.registration]
									})
								]
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/defects/DefectReportPage.tsx
var AIRCRAFT_OPTIONS$2 = aircraft.map((a) => `${a.registration} — ${a.model}`);
var FLIGHT_OPTIONS = [...todaysFlights.map((f) => `${f.id} — ${f.origin} → ${f.destination}`), "Not flight-related"];
var ATA_OPTIONS = [
	"23 — Communications",
	"25 — Equipment & Furnishings",
	"29 — Hydraulic Power",
	"30 — Ice & Rain",
	"32 — Landing Gear",
	"33 — Lights",
	"34 — Navigation"
];
/**
* Mobile-priority defect report form for line use — the form-grid
* collapses to a single column at the tablet breakpoint so it works
* as a pilot walkaround / cabin crew tool on a phone.
*/
function DefectReportPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			crumbs: [
				{ label: "Operations" },
				{
					label: "Defects",
					to: paths.defects
				},
				{ label: "Report" }
			],
			title: "Report a defect",
			description: "Optimised for line use on a phone or tablet — capture what you found, where, and how serious it is. A duty controller triages every report before rectification is scheduled."
		}), /* @__PURE__ */ jsxs("form", {
			className: "form-stack",
			onSubmit: (e) => e.preventDefault(),
			"aria-label": "Report a defect",
			children: [
				/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
					title: "Aircraft & flight",
					hint: "Link the sector where the fault was found, if applicable.",
					children: [/* @__PURE__ */ jsx(SelectField, {
						id: "def-aircraft",
						label: "Aircraft",
						required: true,
						options: AIRCRAFT_OPTIONS$2,
						placeholder: "Select aircraft"
					}), /* @__PURE__ */ jsx(SelectField, {
						id: "def-flight",
						label: "Flight (optional)",
						options: FLIGHT_OPTIONS,
						placeholder: "Select flight",
						hint: "Link the sector where the fault was found"
					})]
				}) }),
				/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
					title: "Defect",
					children: [
						/* @__PURE__ */ jsx(TextField, {
							id: "def-title",
							label: "Defect title",
							required: true,
							full: true,
							placeholder: "Short summary, e.g. Left nav light inop"
						}),
						/* @__PURE__ */ jsx(TextField, {
							id: "def-location",
							label: "Location on aircraft",
							placeholder: "e.g. NLG bay"
						}),
						/* @__PURE__ */ jsx(SelectField, {
							id: "def-severity",
							label: "Severity",
							required: true,
							options: [
								"Minor",
								"Significant",
								"Critical"
							],
							placeholder: "Select severity",
							hint: "Critical triggers an immediate AOG review by the duty controller"
						}),
						/* @__PURE__ */ jsx(SelectField, {
							id: "def-ata",
							label: "ATA chapter",
							options: ATA_OPTIONS,
							placeholder: "Select ATA chapter"
						}),
						/* @__PURE__ */ jsx(TextAreaField, {
							id: "def-description",
							label: "Detailed description",
							required: true,
							full: true,
							rows: 6,
							placeholder: "What did you observe? Include what was checked, any indications, and whether the fault is intermittent or confirmed."
						})
					]
				}) }),
				/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsx(FormSection, {
					title: "Photos",
					hint: "A clear photo speeds up triage — attach one if you can.",
					children: /* @__PURE__ */ jsx("div", {
						className: "field field--full",
						children: /* @__PURE__ */ jsx(AttachmentDropzone, { hint: "Photos of the finding — visual preview only, files are not uploaded" })
					})
				}) }),
				/* @__PURE__ */ jsxs(FormCard, { children: [/* @__PURE__ */ jsxs(FormSection, {
					title: "Reporter",
					children: [
						/* @__PURE__ */ jsx(TextField, {
							id: "def-reporter-name",
							label: "Name",
							defaultValue: currentUser.name
						}),
						/* @__PURE__ */ jsx(TextField, {
							id: "def-reporter-licence",
							label: "Licence / staff no.",
							defaultValue: currentUser.licenceNumber ?? currentUser.id
						}),
						/* @__PURE__ */ jsx(SelectField, {
							id: "def-source",
							label: "Report source",
							options: [
								"Pilot Report",
								"Line Inspection",
								"Cabin Crew",
								"Scheduled Check"
							],
							defaultValue: "Pilot Report"
						})
					]
				}), /* @__PURE__ */ jsxs(FormFooter, {
					note: "Preview only — reports are not submitted.",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: paths.defects,
							className: "btn btn--ghost",
							children: "Cancel"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn--secondary",
							children: "Save draft"
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "submit",
							className: "btn btn--primary",
							children: [/* @__PURE__ */ jsx(Send, {
								size: 15,
								"aria-hidden": "true"
							}), "Submit defect"]
						})
					]
				})] })
			]
		})]
	});
}
//#endregion
//#region src/pages/defects/DefectReviewPage.tsx
function DefectReviewPage() {
	const [selectedId, setSelectedId] = useState(reviewQueueDefects[0]?.id ?? "");
	const selected = reviewQueueDefects.find((d) => d.id === selectedId) ?? reviewQueueDefects[0];
	const oldest = reviewQueueDefects.reduce((min, d) => d.reportedAt < min ? d.reportedAt : min, reviewQueueDefects[0]?.reportedAt ?? "");
	const criticalWaiting = reviewQueueDefects.filter((d) => d.severity === "Critical").length;
	const aircraftAffected = new Set(reviewQueueDefects.map((d) => d.aircraftId)).size;
	const suggestedActions = (() => {
		if (!selected) return null;
		if (selected.severity === "Critical") return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "btn btn--danger",
			children: "Ground aircraft (AOG)"
		}), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "btn btn--primary",
			children: "Create work order"
		})] });
		if (selected.severity === "Significant") return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "btn btn--primary",
			children: "Create work order"
		}), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "btn btn--secondary",
			children: "Defer"
		})] });
		return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "btn btn--secondary",
			children: "Defer"
		}), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "btn btn--secondary",
			children: "Create work order"
		})] });
	})();
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [
					{ label: "Operations" },
					{
						label: "Defects",
						to: paths.defects
					},
					{ label: "Review queue" }
				],
				title: "Defect review queue",
				description: "Newly reported and in-review defects, ordered by severity then age. Triage each one to defer, escalate, or raise a work order.",
				actions: /* @__PURE__ */ jsx(Link, {
					to: paths.defects,
					className: "btn btn--secondary",
					children: "All defects"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "split-view",
				children: [/* @__PURE__ */ jsx("div", {
					className: "split-list",
					children: reviewQueueDefects.map((d) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "queue-card",
						"aria-pressed": d.id === selectedId,
						"data-selected": d.id === selectedId,
						onClick: () => setSelectedId(d.id),
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "queue-card-top",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "ref",
										children: d.id
									}),
									/* @__PURE__ */ jsx(SeverityBadge, { severity: d.severity }),
									/* @__PURE__ */ jsx(StatusBadge, { status: d.status })
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "queue-card-title",
								children: d.title
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "queue-card-meta",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "ref",
										children: d.aircraftId
									}),
									/* @__PURE__ */ jsxs("span", { children: ["reported ", fmtRelative(d.reportedAt)] }),
									/* @__PURE__ */ jsx("span", { children: shortName(d.reportedByUserId) }),
									/* @__PURE__ */ jsx("span", { children: d.ataChapter })
								]
							})
						]
					}, d.id))
				}), selected && /* @__PURE__ */ jsxs("section", {
					className: "card",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "card-header",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "card-title",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "ref",
										children: selected.id
									}),
									" ",
									selected.title
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "card-actions",
								children: /* @__PURE__ */ jsx(Link, {
									to: paths.defect(selected.id),
									className: "btn btn--primary btn--sm",
									children: "Open full defect"
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "card-body",
							style: {
								display: "flex",
								flexDirection: "column",
								gap: 16
							},
							children: [
								/* @__PURE__ */ jsx("p", { children: selected.description }),
								/* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Aircraft",
										value: /* @__PURE__ */ jsx(Link, {
											to: paths.aircraftDetail(selected.aircraftId),
											children: selected.aircraftId
										})
									},
									{
										label: "Flight",
										value: selected.flightId ? /* @__PURE__ */ jsx(Link, {
											to: paths.flight(selected.flightId),
											children: selected.flightId
										}) : "—"
									},
									{
										label: "Severity",
										value: /* @__PURE__ */ jsx(SeverityBadge, { severity: selected.severity })
									},
									{
										label: "Age",
										value: fmtRelative(selected.reportedAt)
									},
									{
										label: "Reporter",
										value: userName(selected.reportedByUserId)
									},
									{
										label: "Source",
										value: selected.source
									},
									{
										label: "ATA chapter",
										value: selected.ataChapter
									}
								] }),
								/* @__PURE__ */ jsxs(Banner, {
									tone: "warn",
									children: [
										/* @__PURE__ */ jsx("strong", { children: "Availability impact." }),
										" ",
										selected.availabilityImpact
									]
								}),
								selected.flightImpact && /* @__PURE__ */ jsxs(Banner, {
									tone: "info",
									children: [
										/* @__PURE__ */ jsx("strong", { children: "Flight impact." }),
										" ",
										selected.flightImpact
									]
								}),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("h3", {
										style: {
											fontSize: "var(--fs-md)",
											fontWeight: 600,
											marginBottom: 8
										},
										children: "Suggested next actions"
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: 8,
											flexWrap: "wrap",
											alignItems: "center"
										},
										children: [suggestedActions, /* @__PURE__ */ jsx("button", {
											type: "button",
											className: "btn btn--ghost",
											children: "Start review"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "muted",
										style: {
											fontSize: "var(--fs-sm)",
											marginTop: 8
										},
										children: "Actions are visual previews — no state changes."
									})
								] })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "card-footer",
							children: [
								/* @__PURE__ */ jsxs("span", { children: [
									selected.attachments.length,
									" attachment",
									selected.attachments.length === 1 ? "" : "s"
								] }),
								/* @__PURE__ */ jsx("span", { children: "·" }),
								/* @__PURE__ */ jsxs("span", { children: ["Last update: ", selected.timeline[selected.timeline.length - 1]?.title] })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsx("h2", {
						className: "card-title",
						children: "Queue insights"
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "card-body",
					children: /* @__PURE__ */ jsxs("div", {
						className: "metric-grid",
						children: [
							/* @__PURE__ */ jsx(MetricCard, {
								label: "Oldest report",
								value: oldest ? fmtRelative(oldest) : "—",
								icon: Clock
							}),
							/* @__PURE__ */ jsx(MetricCard, {
								label: "Critical waiting",
								value: criticalWaiting,
								tone: "red",
								icon: OctagonAlert
							}),
							/* @__PURE__ */ jsx(MetricCard, {
								label: "Aircraft affected",
								value: aircraftAffected,
								icon: Plane
							})
						]
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/work-orders/WorkOrdersPage.tsx
var STATUS_OPTIONS$1 = [
	"Open",
	"Assigned",
	"In Progress",
	"Awaiting Parts",
	"Awaiting Inspection",
	"Ready for Sign-off",
	"Closed",
	"Cancelled"
];
var PRIORITY_OPTIONS = [
	"Routine",
	"Urgent",
	"AOG"
];
var AIRCRAFT_OPTIONS$1 = [...new Set(workOrders.map((w) => w.aircraftId))].sort();
var ENGINEER_OPTIONS$1 = [...new Set(users.filter((u) => u.role === "Engineer" || u.role === "Licensed Engineer").map((u) => u.name))].sort();
var aogOpenCount = openWorkOrders.filter((w) => w.priority === "AOG").length;
var awaitingPartsCount = workOrders.filter((w) => w.status === "Awaiting Parts").length;
var readyForSignOffCount = workOrders.filter((w) => w.status === "Ready for Sign-off").length;
var closedCount = workOrders.filter((w) => w.status === "Closed").length;
function WorkOrdersPage() {
	const [q, setQ] = useState("");
	const [status, setStatus] = useState("");
	const [priority, setPriority] = useState("");
	const [aircraft, setAircraft] = useState("");
	const [engineer, setEngineer] = useState("");
	const rows = useMemo(() => [...workOrders].filter((w) => {
		const text = `${w.id} ${w.title} ${w.aircraftId}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (status && w.status !== status) return false;
		if (priority && w.priority !== priority) return false;
		if (aircraft && w.aircraftId !== aircraft) return false;
		if (engineer) {
			if (getUser(w.assignedToUserId ?? "")?.name !== engineer) return false;
		}
		return true;
	}).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [
		q,
		status,
		priority,
		aircraft,
		engineer
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Operations" }, { label: "Work orders" }],
				title: "Work orders",
				description: "Every maintenance work order across the fleet — from routine checks to AOG recovery — with live task, parts and sign-off progress.",
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(Link, {
					to: paths.myWorkOrders,
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(ClipboardCheck, {
						size: 15,
						"aria-hidden": "true"
					}), "My assignments"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: paths.workOrderNew,
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Plus, {
						size: 15,
						"aria-hidden": "true"
					}), "Create work order"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Open",
						value: openWorkOrders.length,
						tone: "blue"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "AOG priority",
						value: aogOpenCount,
						tone: "red"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Awaiting parts",
						value: awaitingPartsCount,
						tone: "orange"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Ready for sign-off",
						value: readyForSignOffCount,
						tone: "orange",
						to: paths.workOrderSignOff("WO-2026-0035")
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Closed",
						value: closedCount,
						tone: "green"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search reference, title, aircraft…",
							value: q,
							onChange: setQ,
							width: 260
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Status",
							allLabel: "All statuses",
							options: STATUS_OPTIONS$1,
							value: status,
							onChange: setStatus
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Priority",
							allLabel: "All priorities",
							options: PRIORITY_OPTIONS,
							value: priority,
							onChange: setPriority
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Aircraft",
							allLabel: "All aircraft",
							options: AIRCRAFT_OPTIONS$1,
							value: aircraft,
							onChange: setAircraft
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Engineer",
							allLabel: "All engineers",
							options: ENGINEER_OPTIONS$1,
							value: engineer,
							onChange: setEngineer
						})
					] })
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Work order board",
					columns: [
						{
							key: "ref",
							header: "Reference",
							render: (w) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
								to: paths.workOrder(w.id),
								className: "table-link ref",
								children: w.id
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: fmtRelative(w.createdAt)
							})] })
						},
						{
							key: "aircraft",
							header: "Aircraft",
							render: (w) => /* @__PURE__ */ jsx(Link, {
								to: paths.aircraftDetail(w.aircraftId),
								className: "chip ref",
								children: w.aircraftId
							})
						},
						{
							key: "defect",
							header: "Source defect",
							hideMobile: true,
							render: (w) => w.defectId ? /* @__PURE__ */ jsx(Link, {
								to: paths.defect(w.defectId),
								className: "table-link ref",
								children: w.defectId
							}) : /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "—"
							})
						},
						{
							key: "description",
							header: "Description",
							render: (w) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "cell-main",
								children: w.title
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: w.description
							})] })
						},
						{
							key: "priority",
							header: "Priority",
							render: (w) => /* @__PURE__ */ jsx(PriorityBadge, { priority: w.priority })
						},
						{
							key: "status",
							header: "Status",
							render: (w) => /* @__PURE__ */ jsx(StatusBadge, { status: w.status })
						},
						{
							key: "engineer",
							header: "Engineer",
							render: (w) => shortName(w.assignedToUserId)
						},
						{
							key: "due",
							header: "Due",
							hideMobile: true,
							render: (w) => /* @__PURE__ */ jsx("span", {
								className: "nowrap",
								children: fmtDateTime(w.dueAt)
							})
						},
						{
							key: "progress",
							header: "Progress",
							render: (w) => {
								const done = w.tasks.filter((t) => t.done).length;
								const total = w.tasks.length;
								return /* @__PURE__ */ jsx(ProgressBar, {
									value: total === 0 ? 0 : done / total * 100,
									tone: w.status === "Ready for Sign-off" ? "orange" : void 0,
									label: `${done} of ${total} tasks complete`
								});
							}
						},
						{
							key: "parts",
							header: "Parts",
							hideMobile: true,
							render: (w) => w.partsState === "Not Required" ? /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "—"
							}) : /* @__PURE__ */ jsx(StatusBadge, { status: w.partsState })
						},
						{
							key: "signoff",
							header: "Sign-off",
							render: (w) => {
								if (w.signOffId) return /* @__PURE__ */ jsx(Link, {
									to: paths.workOrderSignOff(w.id),
									className: "table-link ref",
									children: w.signOffId
								});
								if (w.status === "Ready for Sign-off") return /* @__PURE__ */ jsx(Link, {
									to: paths.workOrderSignOff(w.id),
									className: "btn btn--primary btn--sm",
									children: "Certify"
								});
								return /* @__PURE__ */ jsx("span", {
									className: "muted",
									children: "—"
								});
							}
						}
					],
					rows,
					rowKey: (w) => w.id,
					rowTone: (w) => w.priority === "AOG" && w.status !== "Closed" && w.status !== "Cancelled" ? "red" : w.status === "Awaiting Parts" || w.status === "Ready for Sign-off" ? "orange" : void 0,
					empty: /* @__PURE__ */ jsx(EmptyState, {
						icon: Wrench,
						title: "No work orders match these filters",
						children: "Adjust the search or clear a filter to see the rest of the board."
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: workOrders.length
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/work-orders/WorkOrderDetailPage.tsx
function WorkOrderDetailPage() {
	const { id = "" } = useParams();
	const w = getWorkOrder(id);
	if (!w) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const ac = getAircraft(w.aircraftId);
	const signOff = w.signOffId ? getSignOff(w.signOffId) : void 0;
	const requests = requestsForWorkOrder(w.id);
	const done = w.tasks.filter((t) => t.done).length;
	const total = w.tasks.length;
	const totalHours = w.labour.reduce((sum, l) => sum + l.hours, 0);
	const requestCols = [
		{
			key: "req",
			header: "Request",
			render: (r) => /* @__PURE__ */ jsx(Link, {
				to: paths.inventoryRequests,
				className: "table-link ref",
				children: r.id
			})
		},
		{
			key: "part",
			header: "Part",
			render: (r) => {
				return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
					className: "cell-main",
					children: getPart(r.partId)?.description ?? r.partId
				}), /* @__PURE__ */ jsx("span", {
					className: "cell-sub",
					children: r.partId
				})] });
			}
		},
		{
			key: "qty",
			header: "Qty",
			numeric: true,
			render: (r) => r.quantity
		},
		{
			key: "status",
			header: "Status",
			render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.status })
		}
	];
	const labourCols = [
		{
			key: "engineer",
			header: "Engineer",
			render: (l) => shortName(l.userId)
		},
		{
			key: "date",
			header: "Date",
			render: (l) => fmtDate(l.date)
		},
		{
			key: "hours",
			header: "Hours",
			numeric: true,
			render: (l) => l.hours.toFixed(1)
		},
		{
			key: "note",
			header: "Note",
			render: (l) => l.note
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(Breadcrumbs, { crumbs: [{
				label: "Work orders",
				to: paths.workOrders
			}, { label: w.id }] }),
			/* @__PURE__ */ jsx(EntityHeader, {
				identIcon: Wrench,
				identTone: w.priority === "AOG" ? "red" : void 0,
				title: /* @__PURE__ */ jsx("span", {
					className: "ref",
					children: w.id
				}),
				badges: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(PriorityBadge, { priority: w.priority }), /* @__PURE__ */ jsx(StatusBadge, { status: w.status })] }),
				subtitle: w.title,
				meta: [
					{
						label: "Aircraft",
						value: /* @__PURE__ */ jsx(Link, {
							to: paths.aircraftDetail(w.aircraftId),
							children: w.aircraftId
						})
					},
					...w.defectId ? [{
						label: "Source defect",
						value: /* @__PURE__ */ jsx(Link, {
							to: paths.defect(w.defectId),
							children: w.defectId
						})
					}] : [],
					{
						label: "Assigned",
						value: shortName(w.assignedToUserId)
					},
					{
						label: "Due",
						value: fmtDateTimeFull(w.dueAt)
					},
					{
						label: "Est / actual manhours",
						value: `${w.estimatedManhours}h / ${w.actualManhours}h`
					}
				],
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [
					w.status === "Ready for Sign-off" && /* @__PURE__ */ jsxs(Link, {
						to: paths.workOrderSignOff(w.id),
						className: "btn btn--primary",
						children: [/* @__PURE__ */ jsx(FileCheck2, {
							size: 15,
							"aria-hidden": "true"
						}), "Perform sign-off"]
					}),
					w.status === "Closed" && /* @__PURE__ */ jsxs(Link, {
						to: paths.workOrderSignOff(w.id),
						className: "btn btn--secondary",
						children: [/* @__PURE__ */ jsx(FileCheck2, {
							size: 15,
							"aria-hidden": "true"
						}), "View sign-off record"]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "btn btn--ghost",
						children: [/* @__PURE__ */ jsx(Pencil, {
							size: 15,
							"aria-hidden": "true"
						}), "Edit"]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "btn btn--ghost",
						children: [/* @__PURE__ */ jsx(Printer, {
							size: 15,
							"aria-hidden": "true"
						}), "Print"]
					})
				] })
			}),
			w.priority === "AOG" && /* @__PURE__ */ jsxs(Banner, {
				tone: "danger",
				children: [
					/* @__PURE__ */ jsx("strong", { children: "AOG recovery." }),
					" ",
					ac?.registration ?? w.aircraftId,
					" is grounded pending completion of this work order. Due ",
					fmtDateTimeFull(w.dueAt),
					"."
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "two-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "col-main",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "card-header",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Task checklist"
								}), /* @__PURE__ */ jsx("div", {
									className: "card-actions",
									children: /* @__PURE__ */ jsx(ProgressBar, {
										value: total === 0 ? 0 : done / total * 100,
										label: `${done} of ${total} tasks complete`
									})
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "task-list",
								children: w.tasks.map((t) => /* @__PURE__ */ jsxs("div", {
									className: "task-item",
									"data-done": t.done,
									children: [
										/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											className: "task-check",
											defaultChecked: t.done,
											"aria-label": t.title,
											readOnly: true
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "task-text",
											children: [
												/* @__PURE__ */ jsx("div", {
													className: "task-title",
													children: t.title
												}),
												t.note && /* @__PURE__ */ jsx("div", {
													className: "task-note",
													children: t.note
												}),
												t.done && t.completedByUserId && t.completedAt && /* @__PURE__ */ jsxs("div", {
													className: "task-note",
													children: [
														shortName(t.completedByUserId),
														" · ",
														fmtDateTime(t.completedAt)
													]
												})
											]
										}),
										t.manhours !== void 0 && /* @__PURE__ */ jsxs("div", {
											className: "task-hours",
											children: [t.manhours, "h"]
										})
									]
								}, t.seq))
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Labour entries"
								})
							}), /* @__PURE__ */ jsx(DataTable, {
								caption: `Labour entries for ${w.id}`,
								columns: labourCols,
								rows: w.labour,
								rowKey: (l) => `${l.userId}-${l.date}-${l.note}`,
								compact: true,
								empty: /* @__PURE__ */ jsx(EmptyState, {
									icon: Clock,
									title: "No labour recorded yet",
									children: "Time entries will appear here once work begins."
								}),
								footer: w.labour.length > 0 ? /* @__PURE__ */ jsx("div", {
									className: "table-foot",
									children: /* @__PURE__ */ jsxs("span", { children: ["Total hours: ", /* @__PURE__ */ jsxs("strong", { children: [totalHours.toFixed(1), "h"] })] })
								}) : void 0
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Engineer notes"
								})
							}), w.notes.length === 0 ? /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(EmptyState, {
									icon: Clock,
									title: "No notes yet",
									children: "Progress notes from the assigned team will appear here."
								})
							}) : /* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: w.notes.map((n, i) => /* @__PURE__ */ jsx("div", {
									className: "row-list-item",
									style: { alignItems: "flex-start" },
									children: /* @__PURE__ */ jsxs("div", {
										className: "row-main",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-title",
											children: [shortName(n.byUserId), /* @__PURE__ */ jsx("span", {
												className: "muted",
												style: {
													fontWeight: 400,
													fontSize: "var(--fs-sm)"
												},
												children: fmtDateTime(n.at)
											})]
										}), /* @__PURE__ */ jsx("p", {
											style: { marginTop: 4 },
											children: n.text
										})]
									})
								}, `${n.byUserId}-${n.at}-${i}`))
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Attachments"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(AttachmentGrid, { attachments: w.attachments })
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Activity timeline"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(Timeline, { events: w.timeline })
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-side",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "card-header",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Parts"
								}), /* @__PURE__ */ jsx("div", {
									className: "card-actions",
									children: /* @__PURE__ */ jsx(StatusBadge, { status: w.partsState })
								})]
							}), requests.length > 0 ? /* @__PURE__ */ jsx(DataTable, {
								caption: `Part requests for ${w.id}`,
								columns: requestCols,
								rows: requests,
								rowKey: (r) => r.id,
								compact: true
							}) : /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx("p", {
									className: "muted",
									children: "No parts required."
								})
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Inspection"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: w.inspection.required ? /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 12
									},
									children: [/* @__PURE__ */ jsx(DetailGrid, { items: [
										{
											label: "Type",
											value: w.inspection.type ?? "—"
										},
										{
											label: "Status",
											value: /* @__PURE__ */ jsx(StatusBadge, { status: w.inspection.status ?? "Pending" })
										},
										{
											label: "Inspector",
											value: w.inspection.inspectorUserId ? shortName(w.inspection.inspectorUserId) : "To be assigned"
										}
									] }), w.inspection.note && /* @__PURE__ */ jsx("p", {
										className: "muted",
										children: w.inspection.note
									})]
								}) : /* @__PURE__ */ jsx("p", {
									className: "muted",
									children: "No independent inspection required."
								})
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Sign-off"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 12
								},
								children: signOff ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
									/* @__PURE__ */ jsx(Banner, {
										tone: "info",
										children: "Released to service"
									}),
									/* @__PURE__ */ jsx(DetailGrid, { items: [
										{
											label: "Reference",
											value: /* @__PURE__ */ jsx("span", {
												className: "ref",
												children: signOff.id
											})
										},
										{
											label: "Type",
											value: signOff.type
										},
										{
											label: "Signed by",
											value: userName(signOff.signedByUserId)
										},
										{
											label: "Licence",
											value: /* @__PURE__ */ jsx("span", {
												className: "ref",
												children: signOff.licenceNumber
											})
										},
										{
											label: "Signed at",
											value: fmtDateTimeFull(signOff.signedAt)
										}
									] }),
									/* @__PURE__ */ jsx(Link, {
										to: paths.workOrderSignOff(w.id),
										className: "btn btn--secondary btn--sm",
										style: { alignSelf: "flex-start" },
										children: "View sign-off document"
									})
								] }) : w.status === "Ready for Sign-off" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Banner, {
									tone: "warn",
									children: "Awaiting certification"
								}), /* @__PURE__ */ jsx(Link, {
									to: paths.workOrderSignOff(w.id),
									className: "btn btn--primary btn--sm",
									style: { alignSelf: "flex-start" },
									children: "Perform sign-off"
								})] }) : /* @__PURE__ */ jsx("p", {
									className: "muted",
									children: "Sign-off available once tasks and inspections are complete."
								})
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Audit metadata"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Created by",
										value: userName(w.createdByUserId)
									},
									{
										label: "Created",
										value: fmtDateTimeFull(w.createdAt)
									},
									{
										label: "Cost centre",
										value: w.costCentreCode ? /* @__PURE__ */ jsx(Link, {
											to: paths.accountCostCentres("ACC-001"),
											className: "chip ref",
											children: w.costCentreCode
										}) : "—"
									},
									{
										label: "Scheduled",
										value: w.scheduledStart && w.scheduledEnd ? `${fmtDateTime(w.scheduledStart)} – ${fmtDateTime(w.scheduledEnd)}` : "—"
									},
									{
										label: "Reference",
										value: /* @__PURE__ */ jsx("span", {
											className: "ref",
											children: w.id
										})
									}
								] })
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/work-orders/WorkOrderFormPage.tsx
var AIRCRAFT_OPTIONS = aircraft.map((a) => `${a.registration} — ${a.model}`);
var OPEN_DEFECT_OPTIONS = [...defects.filter((d) => d.status !== "Closed" && d.status !== "Cancelled").map((d) => `${d.id} — ${d.title}`), "No linked defect"];
var ENGINEER_OPTIONS = [...users.filter((u) => u.role === "Engineer" || u.role === "Licensed Engineer").map((u) => u.name), "Assign later"];
var COST_CENTRE_OPTIONS = [
	"LINE-MAINT",
	"HANGAR",
	"AOG-RECOVERY",
	"CHARTER-SUP"
];
function WorkOrderFormPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [
					{ label: "Operations" },
					{
						label: "Work orders",
						to: paths.workOrders
					},
					{ label: "New" }
				],
				title: "Create work order",
				description: "Raise a work order to schedule rectification or scheduled maintenance. Link a defect where applicable so its status carries through automatically."
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "form-stack",
				onSubmit: (e) => e.preventDefault(),
				"aria-label": "Create work order",
				children: [
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
						title: "Work order",
						hint: "What needs to be done, and how urgently.",
						children: [
							/* @__PURE__ */ jsx(SelectField, {
								id: "wo-aircraft",
								label: "Aircraft",
								required: true,
								options: AIRCRAFT_OPTIONS,
								placeholder: "Select aircraft"
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "wo-defect",
								label: "Source defect",
								options: OPEN_DEFECT_OPTIONS,
								placeholder: "Select a defect",
								hint: "Optional — link the defect this work order rectifies"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "wo-title",
								label: "Title",
								required: true,
								full: true,
								placeholder: "e.g. Replace nose gear taxi light lamp"
							}),
							/* @__PURE__ */ jsx(TextAreaField, {
								id: "wo-scope",
								label: "Work scope",
								required: true,
								full: true,
								rows: 5,
								placeholder: "Describe the work to be performed, referencing the applicable maintenance data (AMM reference, task cards, etc.)."
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "wo-priority",
								label: "Priority",
								options: [
									"Routine",
									"Urgent",
									"AOG"
								],
								defaultValue: "Routine",
								hint: "AOG escalates aircraft availability and cost centre automatically"
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "wo-cost-centre",
								label: "Cost centre",
								options: COST_CENTRE_OPTIONS,
								placeholder: "Select cost centre"
							})
						]
					}) }),
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
						title: "Assignment & schedule",
						hint: "Who will do the work, and when it needs to happen.",
						children: [
							/* @__PURE__ */ jsx(SelectField, {
								id: "wo-lead",
								label: "Lead engineer",
								options: ENGINEER_OPTIONS,
								defaultValue: "Assign later"
							}),
							/* @__PURE__ */ jsx(SelectField, {
								id: "wo-support",
								label: "Supporting engineer",
								options: ENGINEER_OPTIONS,
								defaultValue: "Assign later"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "wo-scheduled-start",
								label: "Scheduled start",
								type: "datetime-local"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "wo-due",
								label: "Due",
								type: "datetime-local"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "wo-manhours",
								label: "Estimated manhours",
								type: "number",
								placeholder: "0"
							})
						]
					}) }),
					/* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs(FormSection, {
						title: "Initial tasks",
						hint: "Seed the task checklist — more tasks can be added once the work order is created.",
						children: [
							/* @__PURE__ */ jsx(TextField, {
								id: "wo-task-1",
								label: "Task 1",
								full: true,
								placeholder: "Open access panel and isolate system"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "wo-task-2",
								label: "Task 2",
								full: true,
								placeholder: "Remove unserviceable part and record part off"
							}),
							/* @__PURE__ */ jsx(TextField, {
								id: "wo-task-3",
								label: "Task 3",
								full: true,
								placeholder: "Install serviceable part and operational check"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "field field--full",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost",
									children: "Add another task"
								}), /* @__PURE__ */ jsx("span", {
									className: "field-hint",
									children: "Tasks are numbered in sequence and drive the completion checklist."
								})]
							})
						]
					}) }),
					/* @__PURE__ */ jsxs(FormCard, { children: [/* @__PURE__ */ jsxs(FormSection, {
						title: "Parts & inspection",
						children: [
							/* @__PURE__ */ jsx(CheckRow, {
								id: "wo-parts-required",
								label: "Parts required — raise part requests after creation"
							}),
							/* @__PURE__ */ jsx(CheckRow, {
								id: "wo-inspection-required",
								label: "Independent inspection required"
							}),
							/* @__PURE__ */ jsx(TextAreaField, {
								id: "wo-inspection-notes",
								label: "Inspection notes",
								full: true,
								placeholder: "Describe the inspection scope, e.g. flight-control zone disturbance, duplicate inspection requirements…"
							})
						]
					}), /* @__PURE__ */ jsxs(FormFooter, {
						note: "Preview only — nothing is created or persisted.",
						children: [/* @__PURE__ */ jsx(Link, {
							to: paths.workOrders,
							className: "btn btn--ghost",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							className: "btn btn--primary",
							children: [/* @__PURE__ */ jsx(Save, {
								size: 15,
								"aria-hidden": "true"
							}), "Create work order"]
						})]
					})] })
				]
			}),
			/* @__PURE__ */ jsxs(Banner, {
				tone: "neutral",
				children: [
					"In the full product, creating a work order from a defect updates that defect to",
					" ",
					/* @__PURE__ */ jsx("code", { children: "Work Order Created" }),
					" and adjusts aircraft availability per the documented automation rules."
				]
			})
		]
	});
}
//#endregion
//#region src/pages/work-orders/MyWorkOrdersPage.tsx
var mine = myWorkOrders();
var dueSoon = mine.filter((w) => w.status !== "Closed" && w.status !== "Cancelled").sort((a, b) => a.dueAt.localeCompare(b.dueAt));
var awaitingParts = mine.filter((w) => w.status === "Awaiting Parts");
var awaitingInspection = mine.filter((w) => w.status === "Awaiting Inspection");
var readyForSignOff = mine.filter((w) => w.status === "Ready for Sign-off");
var completedRecently = mine.filter((w) => w.status === "Closed");
var dueTodayCount = mine.filter((w) => (w.dueAt.startsWith("2026-07-15") || w.dueAt.startsWith("2026-07-16")) && w.status !== "Closed" && w.status !== "Cancelled").length;
function woProgress(w) {
	const done = w.tasks.filter((t) => t.done).length;
	return w.tasks.length === 0 ? 0 : done / w.tasks.length * 100;
}
function rowTone(w) {
	if (w.priority === "AOG" && w.status !== "Closed" && w.status !== "Cancelled") return "red";
	if (w.status === "Ready for Sign-off" || w.status === "Awaiting Parts") return "orange";
}
function ItemCard({ w }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "item-card",
		"data-tone": rowTone(w),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "item-card-head",
				children: [/* @__PURE__ */ jsx(Link, {
					to: paths.workOrder(w.id),
					className: "table-link ref item-card-title",
					children: w.id
				}), /* @__PURE__ */ jsx(PriorityBadge, { priority: w.priority })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "item-card-body",
				children: [
					w.title,
					" · ",
					/* @__PURE__ */ jsx("span", {
						className: "ref",
						children: w.aircraftId
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "item-card-meta",
				children: [/* @__PURE__ */ jsxs("span", { children: ["Due ", fmtDateTime(w.dueAt)] }), /* @__PURE__ */ jsx(StatusBadge, { status: w.status })]
			}),
			/* @__PURE__ */ jsx(ProgressBar, {
				value: woProgress(w),
				tone: w.status === "Ready for Sign-off" ? "orange" : void 0
			}),
			w.status === "Ready for Sign-off" && /* @__PURE__ */ jsx(Link, {
				to: paths.workOrderSignOff(w.id),
				className: "btn btn--primary btn--sm",
				style: { alignSelf: "flex-start" },
				children: "Certify now"
			})
		]
	});
}
var columns$1 = [
	{
		key: "ref",
		header: "Reference",
		render: (w) => /* @__PURE__ */ jsx(Link, {
			to: paths.workOrder(w.id),
			className: "table-link ref",
			children: w.id
		})
	},
	{
		key: "aircraft",
		header: "Aircraft",
		render: (w) => /* @__PURE__ */ jsx(Link, {
			to: paths.aircraftDetail(w.aircraftId),
			className: "chip ref",
			children: w.aircraftId
		})
	},
	{
		key: "title",
		header: "Title",
		render: (w) => /* @__PURE__ */ jsx("span", {
			className: "cell-main",
			children: w.title
		})
	},
	{
		key: "priority",
		header: "Priority",
		render: (w) => /* @__PURE__ */ jsx(PriorityBadge, { priority: w.priority })
	},
	{
		key: "status",
		header: "Status",
		render: (w) => /* @__PURE__ */ jsx(StatusBadge, { status: w.status })
	},
	{
		key: "due",
		header: "Due",
		render: (w) => /* @__PURE__ */ jsx("span", {
			className: "nowrap",
			children: fmtDateTime(w.dueAt)
		})
	},
	{
		key: "progress",
		header: "Progress",
		render: (w) => /* @__PURE__ */ jsx(ProgressBar, { value: woProgress(w) })
	},
	{
		key: "action",
		header: "",
		render: (w) => w.status === "Ready for Sign-off" ? /* @__PURE__ */ jsx(Link, {
			to: paths.workOrderSignOff(w.id),
			className: "btn btn--primary btn--sm",
			children: "Certify"
		}) : /* @__PURE__ */ jsx(Link, {
			to: paths.workOrder(w.id),
			className: "btn btn--secondary btn--sm",
			children: "Open"
		})
	}
];
function MyWorkOrdersPage() {
	const [view, setView] = useState("cards");
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Operations" }, { label: "My assignments" }],
				title: "My assignments",
				description: `Work orders assigned to you or where you're the inspecting engineer, ${currentUser.name} — licensed under ${currentUser.licenceNumber}.`,
				actions: /* @__PURE__ */ jsxs(Link, {
					to: paths.defectNew,
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(TriangleAlert, {
						size: 15,
						"aria-hidden": "true"
					}), "Report defect"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "stat-strip",
				role: "group",
				"aria-label": "Assignment summary",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Assigned"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: dueSoon.length
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Due today"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: dueTodayCount
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Awaiting inspection"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: awaitingInspection.length
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Ready for sign-off"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: readyForSignOff.length
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					justifyContent: "flex-end"
				},
				children: /* @__PURE__ */ jsx(Segmented, {
					label: "View",
					value: view,
					onChange: setView,
					options: [{
						label: "Cards",
						value: "cards",
						icon: /* @__PURE__ */ jsx(LayoutGrid, {
							size: 13,
							"aria-hidden": "true"
						})
					}, {
						label: "Table",
						value: "table",
						icon: /* @__PURE__ */ jsx(Rows3, {
							size: 13,
							"aria-hidden": "true"
						})
					}]
				})
			}),
			mine.length === 0 ? /* @__PURE__ */ jsx("section", {
				className: "card",
				children: /* @__PURE__ */ jsx("div", {
					className: "card-body",
					children: /* @__PURE__ */ jsx(EmptyState, {
						icon: TriangleAlert,
						title: "No assignments",
						children: "You have no work orders assigned right now."
					})
				})
			}) : view === "table" ? /* @__PURE__ */ jsx("section", {
				className: "card",
				children: /* @__PURE__ */ jsx(DataTable, {
					caption: "My assigned work orders",
					columns: columns$1,
					rows: mine,
					rowKey: (w) => w.id,
					rowTone
				})
			}) : /* @__PURE__ */ jsxs("div", {
				className: "section-stack",
				children: [
					readyForSignOff.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "card-header",
							children: /* @__PURE__ */ jsx("h2", {
								className: "card-title",
								children: "Ready for sign-off"
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "card-body",
							children: /* @__PURE__ */ jsx("div", {
								className: "card-list",
								children: readyForSignOff.map((w) => /* @__PURE__ */ jsx(ItemCard, { w }, w.id))
							})
						})]
					}),
					dueSoon.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "card-header",
							children: /* @__PURE__ */ jsx("h2", {
								className: "card-title",
								children: "Due soon"
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "card-body",
							children: /* @__PURE__ */ jsx("div", {
								className: "card-list",
								children: dueSoon.map((w) => /* @__PURE__ */ jsx(ItemCard, { w }, w.id))
							})
						})]
					}),
					awaitingParts.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "card-header",
							children: /* @__PURE__ */ jsx("h2", {
								className: "card-title",
								children: "Awaiting parts"
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "card-body",
							children: /* @__PURE__ */ jsx("div", {
								className: "card-list",
								children: awaitingParts.map((w) => /* @__PURE__ */ jsx(ItemCard, { w }, w.id))
							})
						})]
					}),
					awaitingInspection.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "card-header",
							children: /* @__PURE__ */ jsx("h2", {
								className: "card-title",
								children: "Awaiting inspection"
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "card-body",
							children: /* @__PURE__ */ jsx("div", {
								className: "card-list",
								children: awaitingInspection.map((w) => /* @__PURE__ */ jsx(ItemCard, { w }, w.id))
							})
						})]
					}),
					completedRecently.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "card-header",
							children: /* @__PURE__ */ jsx("h2", {
								className: "card-title",
								children: "Completed recently"
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "card-body",
							children: /* @__PURE__ */ jsx("div", {
								className: "card-list",
								children: completedRecently.map((w) => /* @__PURE__ */ jsx(ItemCard, { w }, w.id))
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/pages/work-orders/SignOffPage.tsx
var STANDARD_STATEMENT = "I certify that the work described on this work order has been carried out in accordance with the applicable maintenance data and operator procedures, and in respect of that work the aircraft is released to service.";
function SignOffPage() {
	const { id = "" } = useParams();
	const w = getWorkOrder(id);
	if (!w) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const ac = getAircraft(w.aircraftId);
	const defect = w.defectId ? getDefect(w.defectId) : void 0;
	const signOff = w.signOffId ? getSignOff(w.signOffId) : void 0;
	const done = w.tasks.filter((t) => t.done).length;
	const total = w.tasks.length;
	const isReleased = Boolean(signOff);
	const notReady = !isReleased && w.status !== "Ready for Sign-off";
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(Breadcrumbs, { crumbs: [
				{
					label: "Work orders",
					to: paths.workOrders
				},
				{
					label: w.id,
					to: paths.workOrder(w.id)
				},
				{ label: "Sign-off" }
			] }),
			/* @__PURE__ */ jsx(PrototypeNotice, {}),
			/* @__PURE__ */ jsx("div", {
				className: "signoff-doc",
				children: /* @__PURE__ */ jsxs("section", {
					className: "card",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "card-header",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "card-title",
								children: [/* @__PURE__ */ jsx(FileCheck2, {
									size: 16,
									"aria-hidden": "true"
								}), "Certificate of release to service — preview"]
							}), /* @__PURE__ */ jsx("div", {
								className: "card-actions",
								children: /* @__PURE__ */ jsx(StatusBadge, { status: isReleased ? "Released" : "Awaiting Sign-off" })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "card-body",
							style: {
								display: "flex",
								flexDirection: "column",
								gap: 18
							},
							children: [
								notReady && /* @__PURE__ */ jsxs(Banner, {
									tone: "warn",
									children: [
										"This work order is not yet ready for sign-off (status: ",
										w.status,
										"). Form shown for design preview."
									]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "var(--fs-md)",
										fontWeight: 600,
										marginBottom: 10
									},
									children: "Work order summary"
								}), /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Work order",
										value: /* @__PURE__ */ jsx(Link, {
											to: paths.workOrder(w.id),
											children: w.id
										})
									},
									{
										label: "Aircraft",
										value: ac ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
											/* @__PURE__ */ jsx(Link, {
												to: paths.aircraftDetail(ac.id),
												children: ac.registration
											}),
											" — ",
											ac.model
										] }) : w.aircraftId
									},
									{
										label: "Source defect",
										value: defect ? /* @__PURE__ */ jsx(Link, {
											to: paths.defect(defect.id),
											children: defect.id
										}) : "—"
									},
									{
										label: "Priority",
										value: w.priority
									},
									{
										label: "Work performed",
										value: `${w.title} — ${w.description}`
									},
									{
										label: "Completed tasks",
										value: `${done}/${total}`
									},
									{
										label: "Total manhours",
										value: `${fmtNumber(w.actualManhours, 1)}h`
									}
								] })] }),
								/* @__PURE__ */ jsx("hr", { className: "doc-rule" }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "var(--fs-md)",
										fontWeight: 600,
										marginBottom: 10
									},
									children: "Aircraft details"
								}), ac ? /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Registration",
										value: /* @__PURE__ */ jsx("span", {
											className: "ref",
											children: ac.registration
										})
									},
									{
										label: "Type",
										value: `${ac.manufacturer} ${ac.model}`
									},
									{
										label: "Serial number",
										value: /* @__PURE__ */ jsx("span", {
											className: "ref",
											children: ac.serialNumber
										})
									},
									{
										label: "Hours",
										value: fmtNumber(ac.totalHours, 1)
									},
									{
										label: "Cycles",
										value: fmtNumber(ac.totalCycles)
									}
								] }) : /* @__PURE__ */ jsx("p", {
									className: "muted",
									children: "Aircraft record not found."
								})] }),
								/* @__PURE__ */ jsx("hr", { className: "doc-rule" }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "var(--fs-md)",
										fontWeight: 600,
										marginBottom: 10
									},
									children: "Inspection results"
								}), w.inspection.required ? /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 8
									},
									children: [/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 10,
											flexWrap: "wrap"
										},
										children: [/* @__PURE__ */ jsx("span", { children: w.inspection.type }), /* @__PURE__ */ jsx(StatusBadge, { status: w.inspection.status ?? "Pending" })]
									}), w.inspection.note && /* @__PURE__ */ jsx("p", {
										className: "muted",
										children: w.inspection.note
									})]
								}) : /* @__PURE__ */ jsx("p", {
									className: "muted",
									children: "No independent inspection required."
								})] }),
								/* @__PURE__ */ jsx("hr", { className: "doc-rule" }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "var(--fs-md)",
										fontWeight: 600,
										marginBottom: 10
									},
									children: "Outstanding warnings"
								}), isReleased ? /* @__PURE__ */ jsx(Banner, {
									tone: "info",
									children: "No outstanding warnings at time of release."
								}) : /* @__PURE__ */ jsxs(Banner, {
									tone: "warn",
									children: [
										"Release required by ",
										fmtDateTimeFull(w.dueAt),
										" to keep the aircraft available for its next assigned sector. Confirm parts and inspection are closed out before certifying."
									]
								})] }),
								/* @__PURE__ */ jsx("hr", { className: "doc-rule" }),
								/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(TextAreaField, {
									id: "so-statement",
									label: "Certification statement",
									full: true,
									rows: 4,
									defaultValue: isReleased ? signOff.statement : STANDARD_STATEMENT
								}) }),
								/* @__PURE__ */ jsx("hr", { className: "doc-rule" }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "var(--fs-md)",
										fontWeight: 600,
										marginBottom: 10
									},
									children: "Licensed engineer"
								}), /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Name",
										value: isReleased ? userName(signOff.signedByUserId) : currentUser.name
									},
									{
										label: "Licence / authorisation",
										value: /* @__PURE__ */ jsx("span", {
											className: "ref",
											children: isReleased ? signOff.licenceNumber : currentUser.licenceNumber
										})
									},
									{
										label: "Date & time",
										value: isReleased ? fmtDateTimeFull(signOff.signedAt) : "On certification (preview)"
									},
									{
										label: "Sign-off type",
										value: isReleased ? signOff.type : /* @__PURE__ */ jsx(SelectField, {
											id: "so-type",
											label: "Sign-off type",
											options: [
												"Line Release",
												"Return to Service",
												"Inspection"
											],
											defaultValue: "Line Release"
										})
									}
								] })] }),
								/* @__PURE__ */ jsx("hr", { className: "doc-rule" }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "var(--fs-md)",
										fontWeight: 600,
										marginBottom: 10
									},
									children: "Confirmation checklist"
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 10
									},
									children: [
										/* @__PURE__ */ jsx(CheckRow, {
											id: "so-check-1",
											label: "All tasks completed and recorded",
											defaultChecked: isReleased
										}),
										/* @__PURE__ */ jsx(CheckRow, {
											id: "so-check-2",
											label: "Maintenance data (AMM references) followed",
											defaultChecked: isReleased
										}),
										/* @__PURE__ */ jsx(CheckRow, {
											id: "so-check-3",
											label: "Duplicate/independent inspections complete where required",
											defaultChecked: isReleased
										}),
										/* @__PURE__ */ jsx(CheckRow, {
											id: "so-check-4",
											label: "Tooling and materials accounted for",
											defaultChecked: isReleased
										}),
										/* @__PURE__ */ jsx(CheckRow, {
											id: "so-check-5",
											label: "Aircraft log entries raised",
											defaultChecked: isReleased
										})
									]
								})] }),
								/* @__PURE__ */ jsx("hr", { className: "doc-rule" }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "var(--fs-md)",
										fontWeight: 600,
										marginBottom: 10
									},
									children: "Signature"
								}), /* @__PURE__ */ jsxs("div", {
									className: "signature-box",
									children: [/* @__PURE__ */ jsx("span", {
										className: "signature-name",
										children: isReleased ? userName(signOff.signedByUserId) : currentUser.name
									}), /* @__PURE__ */ jsxs("span", {
										className: "signature-meta",
										children: [isReleased ? signOff.licenceNumber : currentUser.licenceNumber, " · AeroSync MRO release module (preview)"]
									})]
								})] }),
								/* @__PURE__ */ jsx("div", {
									className: "release-statement",
									children: isReleased ? "This aircraft has been released to service in respect of the work described above, in accordance with the certification statement and licence recorded on this document." : "On certification, this aircraft will be released to service in respect of the work described above, in accordance with the certification statement and licence recorded on this document."
								})
							]
						}),
						!isReleased ? /* @__PURE__ */ jsxs(FormFooter, {
							note: "Non-operational prototype — certification is visual only.",
							children: [/* @__PURE__ */ jsx(Link, {
								to: paths.workOrder(w.id),
								className: "btn btn--ghost",
								children: "Cancel"
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "btn btn--primary btn--lg",
								children: [/* @__PURE__ */ jsx(FileCheck2, {
									size: 16,
									"aria-hidden": "true"
								}), "Certify release to service"]
							})]
						}) : /* @__PURE__ */ jsx(FormFooter, {
							note: `Released ${fmtDateTimeFull(signOff.signedAt)} · reference ${signOff.id}`,
							children: /* @__PURE__ */ jsx(Link, {
								to: paths.workOrder(w.id),
								className: "btn btn--secondary",
								children: "Back to work order"
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/pages/signoffs/SignOffsPage.tsx
var TYPES$2 = [
	"Line Release",
	"Return to Service",
	"Inspection"
];
var PERIODS = [
	"Last 6 months",
	"Last 90 days",
	"Last 30 days"
];
function SignOffsPage() {
	const [q, setQ] = useState("");
	const [type, setType] = useState("");
	const [engineer, setEngineer] = useState("");
	const [period, setPeriod] = useState("");
	const engineers = useMemo(() => Array.from(new Set(signOffs.map((s) => getUser(s.signedByUserId)?.name).filter((n) => Boolean(n)))).sort(), []);
	const thisWeek = signOffs.filter((s) => s.signedAt >= "2026-07-13").length;
	const returnToService = signOffs.filter((s) => s.type === "Return to Service").length;
	const licensedEngineers = new Set(signOffs.map((s) => s.signedByUserId)).size;
	const sorted = useMemo(() => [...signOffs].sort((a, b) => b.signedAt.localeCompare(a.signedAt)), []);
	const rows = useMemo(() => sorted.filter((s) => {
		const text = `${s.id} ${s.aircraftId} ${s.workOrderId} ${s.licenceNumber}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (type && s.type !== type) return false;
		if (engineer && getUser(s.signedByUserId)?.name !== engineer) return false;
		return true;
	}), [
		sorted,
		q,
		type,
		engineer
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Maintenance" }, { label: "Sign-offs" }],
				title: "Sign-off history",
				description: "Every certified release to service across the fleet — the primary source for audit and airworthiness review."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Releases",
						value: signOffs.length,
						tone: "green",
						icon: FileCheck2,
						meta: "all time"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "This week",
						value: thisWeek,
						tone: "blue",
						meta: "since Mon 13 Jul"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Return to service",
						value: returnToService,
						meta: "major package releases"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Licensed engineers",
						value: licensedEngineers,
						meta: "active signing authority"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "card-header",
						children: /* @__PURE__ */ jsxs(FilterBar, { children: [
							/* @__PURE__ */ jsx(SearchInput, {
								placeholder: "Search reference, aircraft, licence…",
								value: q,
								onChange: setQ,
								width: 280
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Type",
								allLabel: "All types",
								options: TYPES$2,
								value: type,
								onChange: setType
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Engineer",
								allLabel: "All engineers",
								options: engineers,
								value: engineer,
								onChange: setEngineer
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Period",
								allLabel: "All time",
								options: PERIODS,
								value: period,
								onChange: setPeriod
							})
						] })
					}),
					/* @__PURE__ */ jsx(DataTable, {
						caption: "Sign-off history",
						columns: [
							{
								key: "ref",
								header: "Reference",
								render: (s) => /* @__PURE__ */ jsx(Link, {
									to: paths.workOrderSignOff(s.workOrderId),
									className: "table-link ref",
									children: s.id
								})
							},
							{
								key: "aircraft",
								header: "Aircraft",
								render: (s) => /* @__PURE__ */ jsx(Link, {
									to: paths.aircraftDetail(s.aircraftId),
									className: "chip ref",
									children: s.aircraftId
								})
							},
							{
								key: "wo",
								header: "Work order",
								render: (s) => /* @__PURE__ */ jsx(Link, {
									to: paths.workOrder(s.workOrderId),
									className: "table-link ref",
									children: s.workOrderId
								})
							},
							{
								key: "engineer",
								header: "Licensed engineer",
								render: (s) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
									className: "cell-main",
									children: shortName(s.signedByUserId)
								}), /* @__PURE__ */ jsx("span", {
									className: "cell-sub",
									children: s.licenceNumber
								})] })
							},
							{
								key: "type",
								header: "Type",
								render: (s) => /* @__PURE__ */ jsx(StatusBadge, { status: s.type })
							},
							{
								key: "date",
								header: "Date",
								render: (s) => /* @__PURE__ */ jsx("span", {
									className: "nowrap",
									children: fmtDateTimeFull(s.signedAt)
								})
							},
							{
								key: "release",
								header: "Release status",
								render: (s) => /* @__PURE__ */ jsx(StatusBadge, { status: s.releaseStatus })
							},
							{
								key: "audit",
								header: "Audit state",
								hideMobile: true,
								render: (s) => /* @__PURE__ */ jsx(StatusBadge, { status: s.auditState })
							}
						],
						rows,
						rowKey: (s) => s.id,
						footer: /* @__PURE__ */ jsx(TableFooter, {
							shown: rows.length,
							total: signOffs.length
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "card-footer",
						children: "Sign-offs are immutable; corrections issue a new record with an audit note."
					})
				]
			})
		]
	});
}
//#endregion
//#region src/pages/signoffs/MaintenanceRecordsPage.tsx
var RECORD_TYPES = [
	"Corrective",
	"Inspection",
	"Scheduled"
];
function MaintenanceRecordsPage() {
	const [q, setQ] = useState("");
	const [registration, setRegistration] = useState("");
	const [recordType, setRecordType] = useState("");
	const registrations = useMemo(() => Array.from(new Set(maintenanceRecords.map((r) => r.aircraftId))).sort(), []);
	const aircraftCovered = registrations.length;
	const totalManhours = maintenanceRecords.reduce((sum, r) => sum + r.totalManhours, 0);
	const sorted = useMemo(() => [...maintenanceRecords].sort((a, b) => b.performedAt.localeCompare(a.performedAt)), []);
	const rows = useMemo(() => sorted.filter((r) => {
		const text = `${r.summary} ${r.reference}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (registration && r.aircraftId !== registration) return false;
		if (recordType && r.recordType !== recordType) return false;
		return true;
	}), [
		sorted,
		q,
		registration,
		recordType
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Maintenance" }, { label: "Maintenance records" }],
				title: "Maintenance records",
				description: "Fleet-wide certified maintenance history — every record traces to a work order and release reference, suitable for audit and historical review. For a single aircraft, open its dedicated records view from the aircraft page.",
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(Printer, {
						size: 15,
						"aria-hidden": "true"
					}), "Print pack"]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(Download, {
						size: 15,
						"aria-hidden": "true"
					}), "Export history"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Records",
						value: maintenanceRecords.length,
						icon: Archive,
						meta: "across the fleet"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Aircraft covered",
						value: aircraftCovered,
						meta: "of 10 registered tails"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Certified manhours",
						value: fmtNumber(totalManhours, 1),
						meta: "all records"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Last release",
						value: fmtDateTime(sorted[0].performedAt),
						meta: `${sorted[0].reference} · ${sorted[0].aircraftId}`
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "card-header",
						children: /* @__PURE__ */ jsxs(FilterBar, { children: [
							/* @__PURE__ */ jsx(SearchInput, {
								placeholder: "Search work performed, references…",
								value: q,
								onChange: setQ,
								width: 300
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Aircraft",
								allLabel: "All aircraft",
								options: registrations,
								value: registration,
								onChange: setRegistration
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Record type",
								allLabel: "All types",
								options: RECORD_TYPES,
								value: recordType,
								onChange: setRecordType
							})
						] })
					}),
					/* @__PURE__ */ jsx(DataTable, {
						caption: "Fleet-wide maintenance records",
						columns: [
							{
								key: "released",
								header: "Released",
								render: (r) => /* @__PURE__ */ jsx("span", {
									className: "nowrap",
									children: fmtDateTime(r.performedAt)
								})
							},
							{
								key: "aircraft",
								header: "Aircraft",
								render: (r) => /* @__PURE__ */ jsx(Link, {
									to: paths.aircraftDetail(r.aircraftId),
									className: "chip ref",
									children: r.aircraftId
								})
							},
							{
								key: "type",
								header: "Type",
								render: (r) => /* @__PURE__ */ jsx(StatusBadge, {
									status: r.recordType === "Corrective" ? "In Progress" : "Complete",
									title: r.recordType
								})
							},
							{
								key: "summary",
								header: "Work performed",
								render: (r) => /* @__PURE__ */ jsx("span", {
									className: "cell-main",
									children: r.summary
								})
							},
							{
								key: "wo",
								header: "Work order",
								render: (r) => /* @__PURE__ */ jsx(Link, {
									to: paths.workOrder(r.workOrderId),
									className: "table-link ref",
									children: r.workOrderId
								})
							},
							{
								key: "defect",
								header: "Defect",
								hideMobile: true,
								render: (r) => r.defectId ? /* @__PURE__ */ jsx(Link, {
									to: paths.defect(r.defectId),
									className: "table-link ref",
									children: r.defectId
								}) : /* @__PURE__ */ jsx("span", {
									className: "muted",
									children: "—"
								})
							},
							{
								key: "performed",
								header: "Performed by",
								hideMobile: true,
								render: (r) => shortName(r.performedByUserId)
							},
							{
								key: "certified",
								header: "Licensed engineer",
								render: (r) => shortName(r.certifiedByUserId)
							},
							{
								key: "hours",
								header: "Manhours",
								numeric: true,
								hideMobile: true,
								render: (r) => /* @__PURE__ */ jsx("span", {
									className: "num",
									children: r.totalManhours.toFixed(1)
								})
							},
							{
								key: "release",
								header: "Release ref.",
								render: (r) => /* @__PURE__ */ jsx(Link, {
									to: paths.workOrderSignOff(r.workOrderId),
									className: "table-link ref",
									children: r.reference
								})
							}
						],
						rows,
						rowKey: (r) => r.id,
						footer: /* @__PURE__ */ jsx(TableFooter, {
							shown: rows.length,
							total: maintenanceRecords.length
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "card-footer",
						children: "Records are generated automatically at sign-off and are immutable; corrections are issued as new records with an audit note."
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/ui/usePagination.ts
/** Paginate a mock list locally (preview behaviour — no data fetching). */
function usePagination(rows, perPage) {
	const [page, setPage] = useState(1);
	const pages = Math.max(1, Math.ceil(rows.length / perPage));
	const clamped = Math.min(page, pages);
	return {
		page: clamped,
		pages,
		setPage,
		rows: rows.slice((clamped - 1) * perPage, clamped * perPage)
	};
}
//#endregion
//#region src/pages/inventory/PartsPage.tsx
var STOCK_STATES = [
	"In Stock",
	"Low Stock",
	"Out of Stock",
	"Quarantine"
];
function PartsPage() {
	const [q, setQ] = useState("");
	const [category, setCategory] = useState("");
	const [effectivity, setEffectivity] = useState("");
	const [stockState, setStockState] = useState("");
	const categories = useMemo(() => Array.from(new Set(parts$1.map((p) => p.category))).sort(), []);
	const effectivities = useMemo(() => Array.from(new Set(parts$1.map((p) => p.effectivity))).sort(), []);
	const lowStock = parts$1.filter((p) => p.stockState === "Low Stock").length;
	const outOfStock = parts$1.filter((p) => p.stockState === "Out of Stock").length;
	const quarantined = parts$1.filter((p) => p.stockState === "Quarantine").length;
	const rows = useMemo(() => parts$1.filter((p) => {
		const text = `${p.id} ${p.description} ${p.manufacturer}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (category && p.category !== category) return false;
		if (effectivity && p.effectivity !== effectivity) return false;
		if (stockState && p.stockState !== stockState) return false;
		return true;
	}), [
		q,
		category,
		effectivity,
		stockState
	]);
	const paged = usePagination(rows, 12);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Supply & Commercial" }, { label: "Parts catalogue" }],
				title: "Parts catalogue",
				description: "Every part number held or approved for use across the fleet, with effectivity, category and current stock state.",
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
					to: paths.inventoryStock,
					className: "btn btn--secondary",
					children: "Stock levels"
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Plus, {
						size: 15,
						"aria-hidden": "true"
					}), "Add part"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Catalogued parts",
						value: parts$1.length,
						icon: Package,
						meta: "active part numbers"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Low stock",
						value: lowStock,
						tone: "orange",
						meta: "below reorder level"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Out of stock",
						value: outOfStock,
						tone: "red",
						meta: "no serviceable units"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Quarantined",
						value: quarantined,
						tone: "amber",
						meta: "pending cert review"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search part number, description, manufacturer…",
							value: q,
							onChange: setQ,
							width: 300
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Category",
							allLabel: "All categories",
							options: categories,
							value: category,
							onChange: setCategory
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Effectivity",
							allLabel: "All effectivities",
							options: effectivities,
							value: effectivity,
							onChange: setEffectivity
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Stock state",
							allLabel: "All stock states",
							options: STOCK_STATES,
							value: stockState,
							onChange: setStockState
						})
					] })
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Parts catalogue",
					columns: [
						{
							key: "ref",
							header: "Part number",
							render: (p) => /* @__PURE__ */ jsx("strong", {
								className: "ref",
								children: p.id
							})
						},
						{
							key: "desc",
							header: "Description",
							render: (p) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "cell-main",
								children: p.description
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: p.manufacturer
							})] })
						},
						{
							key: "category",
							header: "Category",
							hideMobile: true,
							render: (p) => p.category
						},
						{
							key: "ata",
							header: "ATA",
							hideMobile: true,
							render: (p) => p.ataChapter
						},
						{
							key: "effectivity",
							header: "Effectivity",
							render: (p) => p.effectivity
						},
						{
							key: "stock",
							header: "Stock state",
							render: (p) => /* @__PURE__ */ jsx(StatusBadge, { status: p.stockState })
						},
						{
							key: "uom",
							header: "UoM",
							hideMobile: true,
							render: (p) => p.unitOfMeasure
						},
						{
							key: "reorder",
							header: "Reorder level",
							numeric: true,
							hideMobile: true,
							render: (p) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: p.reorderLevel
							})
						},
						{
							key: "cost",
							header: "Unit cost",
							numeric: true,
							hideMobile: true,
							render: (p) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: fmtCurrency(p.unitCost)
							})
						}
					],
					rows: paged.rows,
					rowKey: (p) => p.id,
					rowTone: (p) => p.stockState === "Out of Stock" ? "red" : p.stockState === "Low Stock" ? "orange" : void 0,
					empty: /* @__PURE__ */ jsx(EmptyState, {
						icon: Package,
						title: "No parts match these filters",
						children: "Adjust the search or clear a filter to see the rest of the catalogue."
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: paged.rows.length,
						total: rows.length,
						children: /* @__PURE__ */ jsx(Pagination, {
							pages: paged.pages,
							page: paged.page,
							onChange: paged.setPage
						})
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/inventory/StockPage.tsx
var HEALTH_OPTIONS = ["Low stock only", "Healthy only"];
function StockPage() {
	const [q, setQ] = useState("");
	const [warehouse, setWarehouse] = useState("");
	const [health, setHealth] = useState("");
	const warehouses = useMemo(() => Array.from(new Set(stockLevels.map((s) => s.warehouse))).sort(), []);
	const reservedTotal = stockLevels.reduce((sum, s) => sum + s.reserved, 0);
	const lowStockCount = stockLevels.filter((s) => s.lowStock).length;
	const rows = useMemo(() => stockLevels.filter((s) => {
		const part = getPart(s.partId);
		const text = `${s.partId} ${part?.description ?? ""} ${s.bin}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (warehouse && s.warehouse !== warehouse) return false;
		if (health === "Low stock only" && !s.lowStock) return false;
		if (health === "Healthy only" && s.lowStock) return false;
		return true;
	}), [
		q,
		warehouse,
		health
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Supply & Commercial" }, { label: "Stock levels" }],
				title: "Stock levels",
				description: "Serviceable, unserviceable and reserved quantities by warehouse and bin, across every stock line in the network.",
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--secondary",
					children: "Stock adjustment"
				}), /* @__PURE__ */ jsx(Link, {
					to: paths.inventoryTransactions,
					className: "btn btn--primary",
					children: "New transaction"
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "stat-strip",
				role: "group",
				"aria-label": "Stock summary",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Stock lines"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: stockLevels.length
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Warehouses"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: warehouses.length
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							children: "Reserved units"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							children: reservedTotal
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "stat",
						children: [/* @__PURE__ */ jsx("span", {
							className: "stat-label",
							style: { color: "var(--tone-orange-text)" },
							children: "Low-stock lines"
						}), /* @__PURE__ */ jsx("span", {
							className: "stat-value",
							style: { color: "var(--tone-orange-text)" },
							children: lowStockCount
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "card-header",
						children: /* @__PURE__ */ jsxs(FilterBar, { children: [
							/* @__PURE__ */ jsx(SearchInput, {
								placeholder: "Search part number, bin…",
								value: q,
								onChange: setQ,
								width: 280
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Warehouse",
								allLabel: "All warehouses",
								options: warehouses,
								value: warehouse,
								onChange: setWarehouse
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Stock health",
								allLabel: "All stock",
								options: HEALTH_OPTIONS,
								value: health,
								onChange: setHealth
							})
						] })
					}),
					/* @__PURE__ */ jsx(DataTable, {
						caption: "Stock levels by warehouse and bin",
						columns: [
							{
								key: "part",
								header: "Part",
								render: (s) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
									className: "ref cell-main",
									children: s.partId
								}), /* @__PURE__ */ jsx("span", {
									className: "cell-sub",
									children: getPart(s.partId)?.description ?? "—"
								})] })
							},
							{
								key: "warehouse",
								header: "Warehouse",
								render: (s) => s.warehouse
							},
							{
								key: "bin",
								header: "Bin",
								render: (s) => /* @__PURE__ */ jsx("span", {
									className: "ref",
									children: s.bin
								})
							},
							{
								key: "serviceable",
								header: "Serviceable",
								numeric: true,
								render: (s) => /* @__PURE__ */ jsx("span", {
									className: "num",
									children: s.serviceable
								})
							},
							{
								key: "unserviceable",
								header: "Unserviceable",
								numeric: true,
								render: (s) => /* @__PURE__ */ jsx("span", {
									className: "num",
									children: s.unserviceable
								})
							},
							{
								key: "reserved",
								header: "Reserved",
								numeric: true,
								render: (s) => /* @__PURE__ */ jsx("span", {
									className: "num",
									children: s.reserved
								})
							},
							{
								key: "available",
								header: "Available",
								numeric: true,
								render: (s) => /* @__PURE__ */ jsx("span", {
									className: "num",
									style: { fontWeight: 650 },
									children: Math.max(s.serviceable - s.reserved, 0)
								})
							},
							{
								key: "status",
								header: "Status",
								render: (s) => /* @__PURE__ */ jsx(StatusBadge, { status: s.lowStock ? "Low Stock" : "In Stock" })
							}
						],
						rows,
						rowKey: (s) => `${s.partId}-${s.warehouse}-${s.bin}`,
						rowTone: (s) => s.lowStock ? "orange" : void 0,
						empty: /* @__PURE__ */ jsx(EmptyState, {
							icon: PackageSearch,
							title: "No stock lines match these filters",
							children: "Adjust the search or clear a filter to see the rest of the network."
						}),
						footer: /* @__PURE__ */ jsx(TableFooter, {
							shown: rows.length,
							total: stockLevels.length
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "card-footer",
						children: "Available = serviceable − reserved; quarantine stock is excluded from availability."
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/ui/Overlay.tsx
/**
* Accessible overlay used for preview drawers and dialogs:
* focus moves into the panel on open, Escape and scrim-click close,
* and focus is trapped while open.
*/
function Overlay({ open, onClose, title, children, footer, variant }) {
	const panelRef = useRef(null);
	useEffect(() => {
		if (!open) return;
		const panel = panelRef.current;
		panel?.focus();
		const onKey = (e) => {
			if (e.key === "Escape") {
				onClose();
				return;
			}
			if (e.key === "Tab" && panel) {
				const focusables = panel.querySelectorAll("a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
				if (focusables.length === 0) return;
				const first = focusables[0];
				const last = focusables[focusables.length - 1];
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "overlay-scrim",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ jsxs("div", {
			ref: panelRef,
			className: variant === "drawer" ? "drawer-panel" : "dialog-panel",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": title,
			tabIndex: -1,
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "overlay-head",
					children: [/* @__PURE__ */ jsx("h2", { children: title }), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "icon-btn",
						onClick: onClose,
						"aria-label": "Close",
						children: /* @__PURE__ */ jsx(X, {
							size: 17,
							"aria-hidden": "true"
						})
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "overlay-body",
					children
				}),
				footer && /* @__PURE__ */ jsx("div", {
					className: "overlay-foot",
					children: footer
				})
			]
		})
	});
}
//#endregion
//#region src/pages/inventory/TransactionsPage.tsx
var TYPES$1 = [
	"Issue",
	"Return",
	"Transfer",
	"Adjustment",
	"Receipt"
];
function TransactionsPage() {
	const [q, setQ] = useState("");
	const [type, setType] = useState("");
	const [warehouse, setWarehouse] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(false);
	const warehouses = useMemo(() => Array.from(new Set(stockLevels.map((s) => s.warehouse))).sort(), []);
	const locations = useMemo(() => Array.from(/* @__PURE__ */ new Set([...warehouses, ...aircraft.map((a) => a.registration)])).sort(), [warehouses]);
	const partOptions = useMemo(() => parts$1.map((p) => `${p.id} — ${p.description}`), []);
	const workOrderOptions = useMemo(() => [...openWorkOrders.map((w) => w.id), "No work order"], []);
	const issuesToday = inventoryTransactions.filter((t) => t.type === "Issue" && t.performedAt.startsWith("2026-07-15")).length;
	const receiptsThisWeek = inventoryTransactions.filter((t) => t.type === "Receipt").length;
	const adjustments = inventoryTransactions.filter((t) => t.type === "Adjustment").length;
	const sorted = useMemo(() => [...inventoryTransactions].sort((a, b) => b.performedAt.localeCompare(a.performedAt)), []);
	const rows = useMemo(() => sorted.filter((t) => {
		const part = getPart(t.partId);
		const text = `${t.id} ${t.reference} ${part?.description ?? ""} ${t.fromLocation} ${t.toLocation}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (type && t.type !== type) return false;
		if (warehouse && t.fromLocation !== warehouse && t.toLocation !== warehouse) return false;
		return true;
	}), [
		sorted,
		q,
		type,
		warehouse
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Supply & Commercial" }, { label: "Inventory transactions" }],
				title: "Inventory transactions",
				description: "Issue, return, transfer, adjustment and receipt movements across every warehouse, line locker and aircraft.",
				actions: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--primary",
					onClick: () => setDrawerOpen(true),
					children: [/* @__PURE__ */ jsx(ArrowLeftRight, {
						size: 15,
						"aria-hidden": "true"
					}), "Issue or return part"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Issues today",
						value: issuesToday,
						tone: "blue",
						meta: "15 Jul movements"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Transfers in progress",
						value: 1,
						tone: "amber",
						meta: "EDP en route MEL → MQL"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Receipts this week",
						value: receiptsThisWeek,
						tone: "green",
						meta: "goods-in accepted"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Adjustments",
						value: adjustments,
						meta: "stocktake variances"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search reference, part, location…",
							value: q,
							onChange: setQ,
							width: 280
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Type",
							allLabel: "All types",
							options: TYPES$1,
							value: type,
							onChange: setType
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Warehouse",
							allLabel: "All warehouses",
							options: warehouses,
							value: warehouse,
							onChange: setWarehouse
						})
					] })
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Inventory transactions",
					columns: [
						{
							key: "ref",
							header: "Reference",
							render: (t) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "ref cell-main",
								children: t.id
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: t.reference
							})] })
						},
						{
							key: "type",
							header: "Type",
							render: (t) => /* @__PURE__ */ jsx(StatusBadge, { status: t.type })
						},
						{
							key: "part",
							header: "Part",
							render: (t) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "ref cell-main",
								children: t.partId
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: getPart(t.partId)?.description ?? "—"
							})] })
						},
						{
							key: "qty",
							header: "Qty",
							numeric: true,
							render: (t) => /* @__PURE__ */ jsxs("span", {
								className: "num",
								children: [t.type === "Adjustment" && t.quantity > 0 ? "+" : "", t.quantity]
							})
						},
						{
							key: "wo",
							header: "Work order",
							render: (t) => t.workOrderId ? /* @__PURE__ */ jsx(Link, {
								to: paths.workOrder(t.workOrderId),
								className: "table-link ref",
								children: t.workOrderId
							}) : /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "—"
							})
						},
						{
							key: "aircraft",
							header: "Aircraft",
							hideMobile: true,
							render: (t) => t.aircraftId ? /* @__PURE__ */ jsx(Link, {
								to: paths.aircraftDetail(t.aircraftId),
								className: "chip ref",
								children: t.aircraftId
							}) : /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "—"
							})
						},
						{
							key: "by",
							header: "Performed by",
							hideMobile: true,
							render: (t) => shortName(t.performedByUserId)
						},
						{
							key: "date",
							header: "Date",
							render: (t) => /* @__PURE__ */ jsx("span", {
								className: "nowrap",
								children: fmtDateTime(t.performedAt)
							})
						},
						{
							key: "route",
							header: "From → To",
							render: (t) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "cell-main",
								children: t.fromLocation
							}), /* @__PURE__ */ jsxs("span", {
								className: "cell-sub",
								children: ["→ ", t.toLocation]
							})] })
						}
					],
					rows,
					rowKey: (t) => t.id,
					rowTone: (t) => t.type === "Transfer" && t.id === "ITX-2026-0212" ? "orange" : void 0,
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: inventoryTransactions.length
					})
				})]
			}),
			/* @__PURE__ */ jsx(Overlay, {
				open: drawerOpen,
				onClose: () => setDrawerOpen(false),
				title: "Issue or return part",
				variant: "drawer",
				footer: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--ghost",
					onClick: () => setDrawerOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--primary",
					onClick: () => setDrawerOpen(false),
					children: "Record transaction"
				})] }),
				children: /* @__PURE__ */ jsxs("form", {
					className: "form-grid",
					onSubmit: (e) => e.preventDefault(),
					"aria-label": "Issue or return part",
					children: [
						/* @__PURE__ */ jsx(SelectField, {
							id: "txn-type",
							label: "Transaction type",
							options: [
								"Issue",
								"Return",
								"Transfer",
								"Adjustment"
							],
							defaultValue: "Issue",
							required: true
						}),
						/* @__PURE__ */ jsx(SelectField, {
							id: "txn-part",
							label: "Part",
							options: partOptions,
							placeholder: "Select a part",
							required: true,
							full: true
						}),
						/* @__PURE__ */ jsx(TextField, {
							id: "txn-qty",
							label: "Quantity",
							type: "number",
							defaultValue: "1",
							required: true
						}),
						/* @__PURE__ */ jsx(SelectField, {
							id: "txn-from",
							label: "From location",
							options: locations,
							placeholder: "Select a location",
							required: true
						}),
						/* @__PURE__ */ jsx(SelectField, {
							id: "txn-to",
							label: "To location",
							options: locations,
							placeholder: "Select a location",
							required: true
						}),
						/* @__PURE__ */ jsx(SelectField, {
							id: "txn-wo",
							label: "Work order",
							options: workOrderOptions,
							defaultValue: "No work order",
							full: true
						}),
						/* @__PURE__ */ jsx(TextAreaField, {
							id: "txn-notes",
							label: "Notes",
							placeholder: "Add any handling or routing notes…",
							full: true
						}),
						/* @__PURE__ */ jsx("p", {
							className: "muted",
							style: {
								fontSize: "var(--fs-sm)",
								gridColumn: "1 / -1"
							},
							children: "Preview only — nothing here is recorded against live stock."
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/pages/inventory/RequestsPage.tsx
var URGENCIES = [
	"AOG",
	"Urgent",
	"Routine"
];
var STATUSES = [
	"Open",
	"Approved",
	"Picked",
	"In Transit",
	"Issued",
	"Backordered"
];
function RequestsPage() {
	const [q, setQ] = useState("");
	const [urgency, setUrgency] = useState("");
	const [status, setStatus] = useState("");
	const openCount = partRequests.filter((r) => r.status !== "Issued" && r.status !== "Cancelled").length;
	const aogCount = partRequests.filter((r) => r.urgency === "AOG").length;
	const backorderedCount = partRequests.filter((r) => r.status === "Backordered").length;
	const issuedThisWeek = partRequests.filter((r) => r.status === "Issued").length;
	const sorted = useMemo(() => [...partRequests].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)), []);
	const rows = useMemo(() => sorted.filter((r) => {
		const part = getPart(r.partId);
		const text = `${r.id} ${r.workOrderId} ${r.aircraftId} ${part?.description ?? ""} ${r.note ?? ""}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (urgency && r.urgency !== urgency) return false;
		if (status && r.status !== status) return false;
		return true;
	}), [
		sorted,
		q,
		urgency,
		status
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Supply & Commercial" }, { label: "Part requests" }],
				title: "Part requests",
				description: "Requests raised from work orders, tracked from open through to issue at the bench or line.",
				actions: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Plus, {
						size: 15,
						"aria-hidden": "true"
					}), "New request"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Open requests",
						value: openCount,
						tone: "blue",
						icon: ClipboardList,
						meta: "not yet issued"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "AOG urgency",
						value: aogCount,
						tone: "red",
						meta: "grounding recovery"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Backordered",
						value: backorderedCount,
						tone: "orange",
						meta: "awaiting supplier"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Issued this week",
						value: issuedThisWeek,
						tone: "green",
						meta: "fulfilled at stores"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search request, work order, part…",
							value: q,
							onChange: setQ,
							width: 280
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Urgency",
							allLabel: "All urgencies",
							options: URGENCIES,
							value: urgency,
							onChange: setUrgency
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Status",
							allLabel: "All statuses",
							options: STATUSES,
							value: status,
							onChange: setStatus
						})
					] })
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Part requests",
					columns: [
						{
							key: "ref",
							header: "Request",
							render: (r) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "ref cell-main",
								children: r.id
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: fmtRelative(r.requestedAt)
							})] })
						},
						{
							key: "wo",
							header: "Work order",
							render: (r) => /* @__PURE__ */ jsx(Link, {
								to: paths.workOrder(r.workOrderId),
								className: "table-link ref",
								children: r.workOrderId
							})
						},
						{
							key: "aircraft",
							header: "Aircraft",
							render: (r) => /* @__PURE__ */ jsx(Link, {
								to: paths.aircraftDetail(r.aircraftId),
								className: "chip ref",
								children: r.aircraftId
							})
						},
						{
							key: "part",
							header: "Part",
							render: (r) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "ref cell-main",
								children: r.partId
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: getPart(r.partId)?.description ?? "—"
							})] })
						},
						{
							key: "qty",
							header: "Qty",
							numeric: true,
							render: (r) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: r.quantity
							})
						},
						{
							key: "urgency",
							header: "Urgency",
							render: (r) => /* @__PURE__ */ jsx(PriorityBadge, { priority: r.urgency })
						},
						{
							key: "by",
							header: "Requested by",
							hideMobile: true,
							render: (r) => shortName(r.requestedByUserId)
						},
						{
							key: "status",
							header: "Status",
							render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.status })
						},
						{
							key: "required",
							header: "Required by",
							render: (r) => /* @__PURE__ */ jsx("span", {
								className: "nowrap",
								children: fmtDateTime(r.requiredBy)
							})
						},
						{
							key: "note",
							header: "Note",
							hideMobile: true,
							render: (r) => /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: r.note ?? "—"
							})
						}
					],
					rows,
					rowKey: (r) => r.id,
					rowTone: (r) => r.urgency === "AOG" && r.status !== "Issued" ? "red" : r.status === "Backordered" ? "orange" : void 0,
					empty: /* @__PURE__ */ jsx(EmptyState, {
						icon: ClipboardList,
						title: "No requests match these filters",
						children: "Adjust the search or clear a filter to see the rest of the queue."
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: partRequests.length
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/accounts/AccountsPage.tsx
var TYPES = [
	"Operator",
	"Customer",
	"Internal",
	"Supplier"
];
var BILLING_STATES = [
	"Current",
	"Invoiced",
	"Overdue",
	"Internal"
];
function openWosForAccount(account) {
	return openWorkOrders.filter((w) => getAircraft(w.aircraftId)?.accountId === account.id).length;
}
function AccountsPage() {
	const [q, setQ] = useState("");
	const [type, setType] = useState("");
	const [billingState, setBillingState] = useState("");
	const customers = accounts.filter((a) => a.type === "Customer").length;
	const totalOpenWos = accounts.reduce((sum, a) => sum + openWosForAccount(a), 0);
	const overdueBilling = accounts.filter((a) => a.billingState === "Overdue").length;
	const rows = useMemo(() => accounts.filter((a) => {
		const text = `${a.id} ${a.name} ${a.code}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (type && a.type !== type) return false;
		if (billingState && a.billingState !== billingState) return false;
		return true;
	}), [
		q,
		type,
		billingState
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Supply & Commercial" }, { label: "Accounts" }],
				title: "Accounts",
				description: "Operator, customer, internal and supplier accounts — billing state, cost centres and the aircraft attached to each.",
				actions: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Plus, {
						size: 15,
						"aria-hidden": "true"
					}), "New account"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Accounts",
						value: accounts.length,
						meta: "operator, customer, supplier"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Customers",
						value: customers,
						tone: "blue",
						meta: "billable relationships"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Open work orders",
						value: totalOpenWos,
						meta: "across account aircraft"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Overdue billing",
						value: overdueBilling,
						tone: "red",
						meta: "follow up required"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search account, code…",
							value: q,
							onChange: setQ,
							width: 280
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Type",
							allLabel: "All types",
							options: TYPES,
							value: type,
							onChange: setType
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Billing state",
							allLabel: "All billing states",
							options: BILLING_STATES,
							value: billingState,
							onChange: setBillingState
						})
					] })
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Accounts",
					columns: [
						{
							key: "account",
							header: "Account",
							render: (a) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
								to: paths.account(a.id),
								className: "table-link cell-main",
								children: a.name
							}), /* @__PURE__ */ jsxs("span", {
								className: "cell-sub",
								children: [
									a.code,
									" · ",
									/* @__PURE__ */ jsx("span", {
										className: "ref",
										children: a.id
									})
								]
							})] })
						},
						{
							key: "type",
							header: "Type",
							render: (a) => /* @__PURE__ */ jsx(StatusBadge, { status: a.type })
						},
						{
							key: "status",
							header: "Status",
							render: (a) => /* @__PURE__ */ jsx(StatusBadge, { status: a.status })
						},
						{
							key: "contact",
							header: "Primary contact",
							render: (a) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "cell-main",
								children: a.primaryContact.name
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: a.primaryContact.email
							})] })
						},
						{
							key: "openWos",
							header: "Open work orders",
							numeric: true,
							render: (a) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: openWosForAccount(a)
							})
						},
						{
							key: "cost",
							header: "Current cost MTD",
							numeric: true,
							render: (a) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: fmtCurrency(a.currentCostMtd)
							})
						},
						{
							key: "billing",
							header: "Billing",
							render: (a) => /* @__PURE__ */ jsx(StatusBadge, { status: a.billingState })
						},
						{
							key: "aircraft",
							header: "Aircraft",
							numeric: true,
							render: (a) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: a.aircraftIds.length
							})
						}
					],
					rows,
					rowKey: (a) => a.id,
					rowTone: (a) => a.billingState === "Overdue" ? "red" : void 0,
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: accounts.length
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/accounts/AccountDetailPage.tsx
function AccountDetailPage() {
	const { id = "" } = useParams();
	const account = getAccount(id);
	if (!account) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const fleet = account.aircraftIds.map((aid) => getAircraft(aid)).filter((a) => Boolean(a));
	const fleetIds = new Set(fleet.map((a) => a.id));
	const activeWork = openWorkOrders.filter((w) => fleetIds.has(w.aircraftId));
	const recentWork = workOrders.filter((w) => fleetIds.has(w.aircraftId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
	const totalSpend = account.costCentres.reduce((sum, c) => sum + c.spend, 0);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(Breadcrumbs, { crumbs: [
				{ label: "Supply & Commercial" },
				{
					label: "Accounts",
					to: paths.accounts
				},
				{ label: account.name }
			] }),
			/* @__PURE__ */ jsx(EntityHeader, {
				identIcon: Building2,
				title: account.name,
				badges: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(StatusBadge, { status: account.type }), /* @__PURE__ */ jsx(StatusBadge, { status: account.billingState })] }),
				subtitle: `${account.code} · ${account.id} · customer since ${fmtDate(account.since)}`,
				meta: [
					{
						label: "Contact",
						value: account.primaryContact.name
					},
					{
						label: "Email",
						value: account.primaryContact.email
					},
					{
						label: "Phone",
						value: account.primaryContact.phone
					},
					{
						label: "Cost MTD",
						value: fmtCurrency(account.currentCostMtd)
					}
				],
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
					to: paths.accountCostCentres(account.id),
					className: "btn btn--secondary",
					children: "Cost centres"
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Pencil, {
						size: 15,
						"aria-hidden": "true"
					}), "Edit account"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "two-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "col-main",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Aircraft under this account"
								})
							}), /* @__PURE__ */ jsx(DataTable, {
								caption: `Aircraft under ${account.name}`,
								columns: [
									{
										key: "reg",
										header: "Registration",
										render: (a) => /* @__PURE__ */ jsx(Link, {
											to: paths.aircraftDetail(a.id),
											className: "table-link ref",
											children: a.registration
										})
									},
									{
										key: "model",
										header: "Model",
										render: (a) => a.model
									},
									{
										key: "status",
										header: "Availability",
										render: (a) => /* @__PURE__ */ jsx(StatusCell, {
											status: a.availability,
											reason: a.availabilityReason
										})
									},
									{
										key: "risk",
										header: "Maint. risk",
										render: (a) => /* @__PURE__ */ jsx(RiskBadge, { risk: a.maintenanceRisk })
									}
								],
								rows: fleet,
								rowKey: (a) => a.id,
								empty: /* @__PURE__ */ jsx(EmptyState, {
									icon: Plane,
									title: "No aircraft associated",
									children: account.type === "Supplier" ? "Supplier accounts are ad-hoc relationships — parts and logistics only, no aircraft attached." : "This account has no dedicated tails; work is arranged ad-hoc as visiting aircraft require support."
								})
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Active work"
								})
							}), /* @__PURE__ */ jsx(DataTable, {
								caption: `Open work orders for ${account.name}`,
								columns: [
									{
										key: "ref",
										header: "Reference",
										render: (w) => /* @__PURE__ */ jsx(Link, {
											to: paths.workOrder(w.id),
											className: "table-link ref",
											children: w.id
										})
									},
									{
										key: "aircraft",
										header: "Aircraft",
										render: (w) => /* @__PURE__ */ jsx(Link, {
											to: paths.aircraftDetail(w.aircraftId),
											className: "chip ref",
											children: w.aircraftId
										})
									},
									{
										key: "title",
										header: "Title",
										render: (w) => /* @__PURE__ */ jsx("span", {
											className: "cell-main",
											children: w.title
										})
									},
									{
										key: "priority",
										header: "Priority",
										render: (w) => /* @__PURE__ */ jsx(PriorityBadge, { priority: w.priority })
									},
									{
										key: "status",
										header: "Status",
										render: (w) => /* @__PURE__ */ jsx(StatusBadge, { status: w.status })
									}
								],
								rows: activeWork,
								rowKey: (w) => w.id,
								rowTone: (w) => w.priority === "AOG" ? "red" : void 0,
								empty: /* @__PURE__ */ jsx(EmptyState, {
									icon: Building2,
									title: "No active work",
									children: "No open work orders are currently attributed to this account's aircraft."
								})
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Recent work orders"
								})
							}), /* @__PURE__ */ jsx(DataTable, {
								caption: `Recent work orders for ${account.name}`,
								columns: [
									{
										key: "ref",
										header: "Reference",
										render: (w) => /* @__PURE__ */ jsx(Link, {
											to: paths.workOrder(w.id),
											className: "table-link ref",
											children: w.id
										})
									},
									{
										key: "title",
										header: "Title",
										render: (w) => /* @__PURE__ */ jsx("span", {
											className: "cell-main",
											children: w.title
										})
									},
									{
										key: "status",
										header: "Status",
										render: (w) => /* @__PURE__ */ jsx(StatusBadge, { status: w.status })
									},
									{
										key: "created",
										header: "Created",
										render: (w) => /* @__PURE__ */ jsx("span", {
											className: "nowrap",
											children: fmtDateTime(w.createdAt)
										})
									}
								],
								rows: recentWork,
								rowKey: (w) => w.id,
								empty: /* @__PURE__ */ jsx(EmptyState, {
									icon: Building2,
									title: "No work order history",
									children: "Nothing has been raised yet against this account's aircraft."
								})
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-side",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Contact & billing"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Primary contact",
										value: `${account.primaryContact.name} — ${account.primaryContact.title}`
									},
									{
										label: "Email",
										value: account.primaryContact.email
									},
									{
										label: "Phone",
										value: account.primaryContact.phone
									},
									{
										label: "Billing address",
										value: account.billingAddress
									},
									{
										label: "Billing state",
										value: /* @__PURE__ */ jsx(StatusBadge, { status: account.billingState })
									},
									{
										label: "Notes",
										value: account.notes
									}
								] })
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "card-header",
									children: /* @__PURE__ */ jsx("h2", {
										className: "card-title",
										children: "Cost summary"
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "card-body",
									children: account.costCentres.length > 0 ? /* @__PURE__ */ jsx(HBarChart, {
										ariaLabel: `Spend by cost centre for ${account.name}`,
										rows: account.costCentres.map((c) => ({
											label: c.code,
											value: c.spend,
											tone: c.spend / c.budget > .85 ? "orange" : "accent"
										})),
										unit: ""
									}) : /* @__PURE__ */ jsx("p", {
										className: "muted",
										style: { fontSize: "var(--fs-md)" },
										children: "Supplier accounts don't carry internal cost centres — spend here reflects purchase orders raised against this supplier instead."
									})
								}),
								account.costCentres.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "card-footer",
									children: ["Total spend MTD: ", fmtCurrency(totalSpend)]
								})
							]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Activity"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(Timeline, { events: account.activity })
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/accounts/CostCentresPage.tsx
function CostCentresPage() {
	const { id = "" } = useParams();
	const account = getAccount(id);
	if (!account) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const { costCentres } = account;
	const totalSpend = costCentres.reduce((sum, c) => sum + c.spend, 0);
	const totalBudget = costCentres.reduce((sum, c) => sum + c.budget, 0);
	const utilisation = totalBudget > 0 ? Math.round(totalSpend / totalBudget * 100) : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [
					{ label: "Supply & Commercial" },
					{
						label: "Accounts",
						to: paths.accounts
					},
					{
						label: account.name,
						to: paths.account(account.id)
					},
					{ label: "Cost centres" }
				],
				title: `Cost centres — ${account.name}`,
				description: "Budgets, spend and utilisation for every cost centre this account attributes maintenance work to.",
				actions: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Plus, {
						size: 15,
						"aria-hidden": "true"
					}), "New cost centre"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Cost centres",
						value: costCentres.length,
						icon: Building2
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Total spend MTD",
						value: fmtCurrency(totalSpend),
						tone: utilisation > 85 ? "orange" : void 0
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Total budget",
						value: fmtCurrency(totalBudget)
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Utilisation",
						value: `${utilisation}%`,
						tone: utilisation > 100 ? "red" : utilisation > 85 ? "orange" : "green"
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "card",
				children: /* @__PURE__ */ jsx(DataTable, {
					caption: `Cost centres for ${account.name}`,
					columns: [
						{
							key: "code",
							header: "Code",
							render: (c) => /* @__PURE__ */ jsx("span", {
								className: "ref cell-main",
								children: c.code
							})
						},
						{
							key: "name",
							header: "Name",
							render: (c) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "cell-main",
								children: c.name
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: c.description
							})] })
						},
						{
							key: "spend",
							header: "Current spend",
							numeric: true,
							render: (c) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: fmtCurrency(c.spend)
							})
						},
						{
							key: "budget",
							header: "Budget",
							numeric: true,
							hideMobile: true,
							render: (c) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: fmtCurrency(c.budget)
							})
						},
						{
							key: "util",
							header: "Utilisation",
							render: (c) => {
								const pct = c.budget > 0 ? c.spend / c.budget * 100 : 0;
								return /* @__PURE__ */ jsx(ProgressBar, {
									value: pct,
									tone: pct > 100 ? "red" : pct > 85 ? "orange" : void 0
								});
							}
						},
						{
							key: "aircraft",
							header: "Linked aircraft",
							render: (c) => c.aircraftIds.length > 0 ? /* @__PURE__ */ jsx("span", {
								style: {
									display: "flex",
									gap: 6,
									flexWrap: "wrap"
								},
								children: c.aircraftIds.map((aid) => /* @__PURE__ */ jsx(Link, {
									to: paths.aircraftDetail(aid),
									className: "chip ref",
									children: aid
								}, aid))
							}) : /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "—"
							})
						},
						{
							key: "wos",
							header: "Linked work orders",
							render: (c) => c.workOrderIds.length > 0 ? /* @__PURE__ */ jsxs("span", {
								style: {
									display: "flex",
									gap: 6,
									flexWrap: "wrap",
									alignItems: "center"
								},
								children: [c.workOrderIds.slice(0, 2).map((wid) => /* @__PURE__ */ jsx(Link, {
									to: paths.workOrder(wid),
									className: "table-link ref",
									children: wid
								}, wid)), c.workOrderIds.length > 2 && /* @__PURE__ */ jsxs("span", {
									className: "muted",
									children: ["+", c.workOrderIds.length - 2]
								})]
							}) : /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "—"
							})
						},
						{
							key: "status",
							header: "Status",
							render: (c) => /* @__PURE__ */ jsx(StatusBadge, { status: c.status })
						}
					],
					rows: costCentres,
					rowKey: (c) => c.code,
					empty: /* @__PURE__ */ jsxs(EmptyState, {
						icon: Building2,
						title: "No cost centres",
						children: [
							"Supplier accounts don't carry cost centres — spend against ",
							account.name,
							" is tracked through purchase orders instead."
						]
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: costCentres.length,
						total: costCentres.length
					})
				})
			})
		]
	});
}
//#endregion
//#region src/pages/reports/ReportsPage.tsx
var RECENT_REPORTS = [
	{
		id: "RPT-1",
		name: "Fleet availability",
		filters: "All types · MEL & MQL",
		generatedBy: "R. Torres",
		generatedAt: "2026-07-15T09:15",
		period: "Last 7 days",
		format: "CSV"
	},
	{
		id: "RPT-2",
		name: "Audit activity",
		filters: "All modules · This month",
		generatedBy: "L. Andersson",
		generatedAt: "2026-07-15T07:40",
		period: "This month",
		format: "CSV"
	},
	{
		id: "RPT-3",
		name: "Work-order ageing",
		filters: "Open statuses only",
		generatedBy: "P. Raman",
		generatedAt: "2026-07-14T16:05",
		period: "This week",
		format: "PDF"
	},
	{
		id: "RPT-4",
		name: "Account costs",
		filters: "All accounts · MTD",
		generatedBy: "R. Torres",
		generatedAt: "2026-07-14T11:22",
		period: "This month",
		format: "CSV"
	},
	{
		id: "RPT-5",
		name: "Sign-off history",
		filters: "Licensed engineers · Last 90 days",
		generatedBy: "L. Andersson",
		generatedAt: "2026-07-13T14:50",
		period: "Last 90 days",
		format: "PDF"
	}
];
var columns = [
	{
		key: "name",
		header: "Report",
		render: (r) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
			className: "cell-main",
			children: r.name
		}), /* @__PURE__ */ jsx("span", {
			className: "cell-sub",
			children: r.filters
		})] })
	},
	{
		key: "by",
		header: "Generated by",
		render: (r) => r.generatedBy
	},
	{
		key: "at",
		header: "Generated",
		render: (r) => /* @__PURE__ */ jsx("span", {
			className: "nowrap",
			children: fmtDateTime(r.generatedAt)
		})
	},
	{
		key: "period",
		header: "Period",
		render: (r) => r.period
	},
	{
		key: "format",
		header: "Format",
		render: (r) => /* @__PURE__ */ jsx("span", {
			className: "chip",
			children: r.format
		})
	},
	{
		key: "action",
		header: "",
		render: () => /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "btn btn--ghost btn--sm",
			children: "Download"
		})
	}
];
function ReportsPage() {
	const [period, setPeriod] = useState("");
	const [acType, setAcType] = useState("");
	const [base, setBase] = useState("");
	const availabilityValues = availabilityTrend.map((d) => d.available);
	const accountCostRows = accounts.map((a) => ({
		label: a.code,
		value: Math.round(a.currentCostMtd / 1e3),
		tone: "accent"
	}));
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Reports" }],
				title: "Reports",
				description: "Operational and commercial reporting drawn from live fleet, maintenance and inventory data. Every export below is a visual preview.",
				actions: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(CalendarClock, {
						size: 15,
						"aria-hidden": "true"
					}), "Schedule report"]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "card",
				children: /* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Period",
							allLabel: "This month",
							options: [
								"This week",
								"This month",
								"Last 30 days",
								"Custom range…"
							],
							value: period,
							onChange: setPeriod
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Aircraft type",
							allLabel: "All types",
							options: [
								"ATR 72-600",
								"DHC-8-315",
								"Saab 340B",
								"King Air 350"
							],
							value: acType,
							onChange: setAcType
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Base",
							allLabel: "All bases",
							options: ["MEL", "MQL"],
							value: base,
							onChange: setBase
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "btn btn--secondary",
							children: "Apply filters"
						})
					] })
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "report-grid",
				children: [
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(PlaneTakeoff, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "Fleet availability" }),
							/* @__PURE__ */ jsx("p", { children: "Daily available, maintenance and AOG counts across the network for the selected period." }),
							/* @__PURE__ */ jsx(Sparkline, {
								values: availabilityValues,
								ariaLabel: "Fleet availability trend, past 7 days",
								tone: "green"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(OctagonAlert, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "AOG duration" }),
							/* @__PURE__ */ jsx("p", { children: "Time on ground for grounding events this month — 1 event, VH-RXT still recovering at MQL." }),
							/* @__PURE__ */ jsx(HBarChart, {
								ariaLabel: "AOG duration this month",
								unit: "h",
								rows: [{
									label: "VH-RXT",
									value: 5.3,
									tone: "red",
									detail: "ongoing"
								}]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(TriangleAlert, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "Defect trends" }),
							/* @__PURE__ */ jsx("p", { children: "Weekly reported-defect counts, split by severity, over the trailing seven weeks." }),
							/* @__PURE__ */ jsx(Sparkline, {
								values: [
									2,
									1,
									3,
									2,
									4,
									3,
									5
								],
								ariaLabel: "Weekly defect counts, past 7 weeks",
								tone: "orange"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(Wrench, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "Work-order ageing" }),
							/* @__PURE__ */ jsx("p", { children: "Open work orders bucketed by time since creation — highlights anything stuck past a week." }),
							/* @__PURE__ */ jsx(HBarChart, {
								ariaLabel: "Work orders by age bucket",
								rows: [
									{
										label: "<24h",
										value: 3,
										tone: "accent"
									},
									{
										label: "1–3d",
										value: 4,
										tone: "accent"
									},
									{
										label: "3–7d",
										value: 1,
										tone: "accent"
									},
									{
										label: ">7d",
										value: 1,
										tone: "orange"
									}
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(Users, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "Engineer workload" }),
							/* @__PURE__ */ jsx("p", { children: "Recorded labour hours by engineer this week, for capacity and roster planning." }),
							/* @__PURE__ */ jsx(HBarChart, {
								ariaLabel: "Engineer workload this week, hours",
								unit: "h",
								rows: [
									{
										label: "J. Munro",
										value: 6,
										tone: "accent"
									},
									{
										label: "S. Grech",
										value: 3,
										tone: "accent"
									},
									{
										label: "D. Reyes",
										value: 2,
										tone: "accent"
									}
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(Timer, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "Maintenance turnaround" }),
							/* @__PURE__ */ jsx("p", { children: "Actual versus estimated manhours on closed work orders, tracked across recent packages." }),
							/* @__PURE__ */ jsx(Sparkline, {
								values: [
									3.2,
									2.8,
									4.1,
									3.6,
									2.4,
									3.9,
									3.1
								],
								ariaLabel: "Maintenance turnaround trend, hours",
								tone: "blue"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(FileCheck2, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "Sign-off history" }),
							/* @__PURE__ */ jsx("p", { children: "Releases to service by day, split by line release, return-to-service and inspection sign-offs." }),
							/* @__PURE__ */ jsx(Sparkline, {
								values: [
									1,
									0,
									1,
									1,
									2,
									1,
									2
								],
								ariaLabel: "Sign-offs per day, past 7 days",
								tone: "green"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(Package, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "Inventory usage" }),
							/* @__PURE__ */ jsx("p", { children: "Parts consumption by category this month — highlights the categories driving stores activity." }),
							/* @__PURE__ */ jsx(HBarChart, {
								ariaLabel: "Inventory usage by category this month",
								rows: [
									{
										label: "Lighting",
										value: 3,
										tone: "accent"
									},
									{
										label: "Hydraulics",
										value: 2,
										tone: "accent"
									},
									{
										label: "Interiors",
										value: 2,
										tone: "accent"
									}
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(Building2, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "Account costs" }),
							/* @__PURE__ */ jsx("p", { children: "Month-to-date maintenance spend by account, in thousands, for commercial review." }),
							/* @__PURE__ */ jsx(HBarChart, {
								ariaLabel: "Account costs month-to-date, thousands of dollars",
								unit: "k",
								rows: accountCostRows
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("article", {
						className: "report-card",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "report-icon",
								children: /* @__PURE__ */ jsx(ScrollText, {
									size: 17,
									"aria-hidden": "true"
								})
							}),
							/* @__PURE__ */ jsx("h3", { children: "Audit activity" }),
							/* @__PURE__ */ jsx("p", { children: "System-wide audit log volume by day — useful for spotting unusual activity spikes." }),
							/* @__PURE__ */ jsx(Sparkline, {
								values: [
									3,
									4,
									2,
									6,
									5,
									8,
									7
								],
								ariaLabel: "Audit log entries per day, past 7 days",
								tone: "grey"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "report-foot",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--secondary btn--sm",
									children: "Run report"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "btn btn--ghost btn--sm",
									children: "Export CSV"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "card-header",
						children: /* @__PURE__ */ jsx("h2", {
							className: "card-title",
							children: "Recent reports"
						})
					}),
					/* @__PURE__ */ jsx(DataTable, {
						caption: "Recently generated reports",
						columns,
						rows: RECENT_REPORTS,
						rowKey: (r) => r.id
					}),
					/* @__PURE__ */ jsx("div", {
						className: "card-footer",
						children: "Exports are visual only in this preview — no files are generated or downloaded."
					})
				]
			})
		]
	});
}
//#endregion
//#region src/pages/admin/UsersPage.tsx
var ROLE_OPTIONS$1 = [
	"Admin",
	"Fleet Planner",
	"Maintenance Controller",
	"Engineer",
	"Licensed Engineer",
	"Pilot",
	"Stores Officer",
	"Accounts Officer",
	"Auditor"
];
var STATUS_OPTIONS = [
	"Active",
	"Suspended",
	"Invited"
];
function UsersPage() {
	const [q, setQ] = useState("");
	const [role, setRole] = useState("");
	const [status, setStatus] = useState("");
	const [profileName, setProfileName] = useState("");
	const [inviteOpen, setInviteOpen] = useState(false);
	const rows = useMemo(() => users.filter((u) => {
		const text = `${u.name} ${u.email}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (role && u.role !== role) return false;
		if (status && u.status !== status) return false;
		if (profileName && !u.securityProfileIds.some((pid) => getProfile(pid)?.name === profileName)) return false;
		return true;
	}), [
		q,
		role,
		status,
		profileName
	]);
	const active = users.filter((u) => u.status === "Active").length;
	const invited = users.filter((u) => u.status === "Invited").length;
	const suspended = users.filter((u) => u.status === "Suspended").length;
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Administration" }, { label: "Users" }],
				title: "Users",
				description: "Every account with access to AeroSync MRO — role, assigned security profiles and recent sign-in activity.",
				actions: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--primary",
					onClick: () => setInviteOpen(true),
					children: [/* @__PURE__ */ jsx(UserPlus, {
						size: 15,
						"aria-hidden": "true"
					}), "Invite user"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Users",
						value: users.length,
						icon: Users
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Active",
						value: active,
						tone: "green"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Invited",
						value: invited,
						tone: "blue"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Suspended",
						value: suspended,
						tone: "red"
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search name or email…",
							value: q,
							onChange: setQ,
							width: 240
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Role",
							allLabel: "All roles",
							options: ROLE_OPTIONS$1,
							value: role,
							onChange: setRole
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Status",
							allLabel: "All statuses",
							options: STATUS_OPTIONS,
							value: status,
							onChange: setStatus
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Security profile",
							allLabel: "All profiles",
							options: securityProfiles.map((p) => p.name),
							value: profileName,
							onChange: setProfileName
						})
					] })
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Users",
					columns: [
						{
							key: "user",
							header: "User",
							render: (u) => /* @__PURE__ */ jsx(UserChip, {
								userId: u.id,
								link: true
							})
						},
						{
							key: "email",
							header: "Email",
							hideMobile: true,
							render: (u) => /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: u.email
							})
						},
						{
							key: "role",
							header: "Primary role",
							render: (u) => u.role
						},
						{
							key: "profiles",
							header: "Security profiles",
							render: (u) => /* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									gap: 4,
									flexWrap: "wrap"
								},
								children: u.securityProfileIds.map((pid) => {
									const p = getProfile(pid);
									if (!p) return null;
									return /* @__PURE__ */ jsx(Link, {
										to: paths.adminProfile(pid),
										className: "chip",
										children: p.name
									}, pid);
								})
							})
						},
						{
							key: "status",
							header: "Status",
							render: (u) => /* @__PURE__ */ jsx(StatusBadge, { status: u.status })
						},
						{
							key: "login",
							header: "Last login",
							render: (u) => /* @__PURE__ */ jsxs(Fragment$1, { children: [u.lastLoginAt ? /* @__PURE__ */ jsx("span", {
								className: "nowrap",
								children: fmtDateTime(u.lastLoginAt)
							}) : /* @__PURE__ */ jsx("span", {
								className: "muted",
								children: "Never"
							}), u.lastLoginSource && /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								children: u.lastLoginSource
							})] }),
							hideMobile: true
						},
						{
							key: "account",
							header: "Account",
							hideMobile: true,
							render: (u) => /* @__PURE__ */ jsx(Link, {
								to: paths.account(u.accountId),
								className: "chip ref",
								children: u.accountId
							})
						},
						{
							key: "actions",
							header: "",
							render: (u) => /* @__PURE__ */ jsx(Link, {
								to: paths.adminUser(u.id),
								className: "btn btn--ghost btn--sm",
								children: "Manage"
							})
						}
					],
					rows,
					rowKey: (u) => u.id,
					empty: /* @__PURE__ */ jsx(EmptyState, {
						icon: Users,
						title: "No users match these filters",
						children: "Adjust the search or clear a filter to see the rest of the account."
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: users.length
					})
				})]
			}),
			/* @__PURE__ */ jsx(Overlay, {
				open: inviteOpen,
				onClose: () => setInviteOpen(false),
				title: "Invite user",
				variant: "dialog",
				footer: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--ghost",
					onClick: () => setInviteOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--primary",
					onClick: () => setInviteOpen(false),
					children: "Send invitation"
				})] }),
				children: /* @__PURE__ */ jsxs("form", {
					className: "form-grid",
					onSubmit: (e) => e.preventDefault(),
					"aria-label": "Invite user",
					children: [
						/* @__PURE__ */ jsx(TextField, {
							id: "invite-user-email",
							label: "Email",
							type: "email",
							required: true,
							placeholder: "name@aerosync.example",
							full: true
						}),
						/* @__PURE__ */ jsx(SelectField, {
							id: "invite-user-role",
							label: "Role",
							options: ROLE_OPTIONS$1,
							required: true,
							placeholder: "Select role"
						}),
						/* @__PURE__ */ jsx(SelectField, {
							id: "invite-user-profile",
							label: "Security profile",
							options: securityProfiles.map((p) => p.name),
							required: true,
							placeholder: "Select security profile",
							hint: "Multiple profiles can be assigned after the account is created."
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/components/ui/PermissionMatrix.tsx
/**
* Permission matrix preview grouped by domain. Read/create/edit/
* approve/close-style actions per row; checks reflect the profile's
* granted permission codes. Editing is visual only.
*/
function PermissionMatrix({ granted, editable }) {
	const usedActions = [
		"view",
		"create",
		"edit",
		"update",
		"review",
		"assign",
		"request",
		"issue",
		"adjust",
		"defer",
		"approve",
		"perform",
		"suspend",
		"archive",
		"close",
		"export"
	].filter((a) => permissionDomains.some((d) => d.actions.some((x) => x.key === a)));
	return /* @__PURE__ */ jsx("div", {
		className: "perm-matrix-wrap",
		children: /* @__PURE__ */ jsxs("table", {
			className: "perm-matrix",
			children: [
				/* @__PURE__ */ jsxs("caption", {
					className: "visually-hidden",
					children: ["Permission matrix by domain", editable ? " (editor preview)" : ""]
				}),
				/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsx("th", {
					scope: "col",
					children: "Domain"
				}), usedActions.map((a) => /* @__PURE__ */ jsx("th", {
					scope: "col",
					children: a
				}, a))] }) }),
				/* @__PURE__ */ jsx("tbody", { children: permissionDomains.map((domain) => /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsxs("td", {
					className: "perm-domain",
					children: [domain.label, /* @__PURE__ */ jsx("span", {
						className: "cell-sub",
						children: domain.description
					})]
				}), usedActions.map((action) => {
					const applies = domain.actions.some((a) => a.key === action);
					const checked = granted.includes(`${domain.key}.${action}`);
					return /* @__PURE__ */ jsx("td", {
						className: "perm-check",
						children: applies ? /* @__PURE__ */ jsx("span", {
							className: "perm-check-box",
							"data-checked": checked,
							role: editable ? "checkbox" : "img",
							"aria-checked": editable ? checked : void 0,
							"aria-label": `${domain.label} — ${action}${checked ? ": granted" : ": not granted"}`,
							tabIndex: editable ? 0 : void 0,
							children: checked && /* @__PURE__ */ jsx(Check, {
								size: 13,
								"aria-hidden": "true"
							})
						}) : /* @__PURE__ */ jsx("span", {
							className: "perm-check-box",
							"data-na": "true",
							"aria-label": `${domain.label} — ${action}: not applicable`,
							children: /* @__PURE__ */ jsx(Minus, {
								size: 12,
								"aria-hidden": "true",
								style: { color: "var(--text-faint)" }
							})
						})
					}, action);
				})] }, domain.key)) })
			]
		})
	});
}
//#endregion
//#region src/pages/admin/UserDetailPage.tsx
function UserDetailPage() {
	const { id = "" } = useParams();
	const user = getUser(id);
	if (!user) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const profiles = user.securityProfileIds.map((pid) => getProfile(pid)).filter((p) => p !== void 0);
	const effectivePermissions = Array.from(new Set(profiles.flatMap((p) => p.permissions)));
	const activity = auditLogs.filter((a) => a.userId === user.id).slice(0, 6).map((a) => ({
		at: a.at,
		title: a.summary,
		detail: `${a.action} · ${a.entityRef}`,
		byUserId: a.userId,
		tone: a.outcome === "Denied" ? "red" : "blue"
	}));
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(Breadcrumbs, { crumbs: [{
				label: "Users",
				to: paths.adminUsers
			}, { label: user.name }] }),
			/* @__PURE__ */ jsx(EntityHeader, {
				identText: initials(user.name),
				title: user.name,
				badges: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(StatusBadge, { status: user.status }), /* @__PURE__ */ jsx("span", {
					className: "chip",
					children: user.role
				})] }),
				subtitle: `${user.title} · ${user.email}`,
				meta: [
					{
						icon: MapPin,
						label: "Base",
						value: user.base
					},
					{
						icon: Phone,
						label: "Phone",
						value: user.phone
					},
					{
						icon: IdCard,
						label: "User ID",
						value: /* @__PURE__ */ jsx("span", {
							className: "ref",
							children: user.id
						})
					},
					...user.licenceNumber ? [{
						icon: IdCard,
						label: "Licence",
						value: /* @__PURE__ */ jsx("span", {
							className: "ref",
							children: user.licenceNumber
						})
					}] : []
				],
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn--primary",
						children: "Edit user"
					}),
					user.status === "Active" && /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn--danger",
						children: "Suspend user"
					}),
					user.status === "Suspended" && /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn--secondary",
						children: "Reactivate"
					}),
					user.status === "Invited" && /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn btn--secondary",
						children: "Resend invite"
					})
				] })
			}),
			user.status === "Suspended" && /* @__PURE__ */ jsx(Banner, {
				tone: "danger",
				children: "This account is suspended — sign-in is blocked. Suspended 28 Jun 2026 by Marcus Hale pending authorisation renewal."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "two-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "col-main",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Assigned security profiles"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "row-list",
								children: [profiles.length === 0 && /* @__PURE__ */ jsx("div", {
									className: "row-list-item muted",
									children: "No security profiles assigned."
								}), profiles.map((p) => /* @__PURE__ */ jsxs("div", {
									className: "row-list-item",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "row-main",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-title",
											children: [/* @__PURE__ */ jsx(Link, {
												to: paths.adminProfile(p.id),
												children: p.name
											}), p.isSystem && /* @__PURE__ */ jsx("span", {
												className: "chip",
												children: "System"
											})]
										}), /* @__PURE__ */ jsx("div", {
											className: "row-sub",
											children: p.description
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "row-end",
										children: /* @__PURE__ */ jsxs("span", {
											className: "chip",
											children: [p.permissions.length, " permissions"]
										})
									})]
								}, p.id))]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Effective permissions"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								children: [/* @__PURE__ */ jsx("p", {
									className: "muted",
									style: { marginBottom: 12 },
									children: "Union of all assigned profiles."
								}), /* @__PURE__ */ jsx(PermissionMatrix, { granted: effectivePermissions })]
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Recent activity"
								})
							}), activity.length > 0 ? /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(Timeline, { events: activity })
							}) : /* @__PURE__ */ jsx(EmptyState, {
								icon: ScrollText,
								title: "No recent activity",
								children: "No audited actions recorded for this user yet."
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-side",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Access"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Status",
										value: /* @__PURE__ */ jsx(StatusBadge, { status: user.status })
									},
									{
										label: "Primary role",
										value: user.role
									},
									{
										label: "Account",
										value: /* @__PURE__ */ jsxs(Link, {
											to: paths.account(user.accountId),
											children: [
												/* @__PURE__ */ jsx(Building2, {
													size: 13,
													"aria-hidden": "true",
													className: "inline-icon"
												}),
												" ",
												getAccount(user.accountId)?.name ?? user.accountId
											]
										})
									},
									{
										label: "Member since",
										value: fmtDate(user.createdAt)
									}
								] })
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Recent sign-in"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Last login",
										value: user.lastLoginAt ? fmtDateTimeFull(user.lastLoginAt) : "Never"
									},
									{
										label: "Source",
										value: user.lastLoginSource ?? "—"
									},
									{
										label: "MFA",
										value: /* @__PURE__ */ jsx("span", {
											className: "chip",
											children: "Enabled (preview)"
										})
									}
								] })
							})]
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "card",
							children: [/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Contact"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx(DetailGrid, { items: [
									{
										label: "Email",
										value: user.email
									},
									{
										label: "Phone",
										value: user.phone
									},
									{
										label: "Base",
										value: user.base
									}
								] })
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/admin/SecurityProfilesPage.tsx
var ROLE_OPTIONS = [
	"Admin",
	"Fleet Planner",
	"Maintenance Controller",
	"Engineer",
	"Licensed Engineer",
	"Pilot",
	"Stores Officer",
	"Accounts Officer",
	"Auditor"
];
var KIND_OPTIONS = ["System", "Custom"];
function SecurityProfilesPage() {
	const [q, setQ] = useState("");
	const [role, setRole] = useState("");
	const [kind, setKind] = useState("");
	const assignedCount = (profileId) => users.filter((u) => u.securityProfileIds.includes(profileId)).length;
	const rows = useMemo(() => securityProfiles.filter((p) => {
		const text = `${p.name} ${p.description}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (role && p.typicalRole !== role) return false;
		if (kind === "System" && !p.isSystem) return false;
		if (kind === "Custom" && p.isSystem) return false;
		return true;
	}), [
		q,
		role,
		kind
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Administration" }, { label: "Security profiles" }],
				title: "Security profiles",
				description: "A two-layer access model: roles describe who a user is; security profiles describe exactly what they can do.",
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--secondary",
					children: "Duplicate from existing"
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--primary",
					children: [/* @__PURE__ */ jsx(Plus, {
						size: 15,
						"aria-hidden": "true"
					}), "New profile"]
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Profiles",
						value: securityProfiles.length,
						icon: ShieldCheck
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "System profiles",
						value: securityProfiles.filter((p) => p.isSystem).length,
						tone: "grey"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Custom",
						value: securityProfiles.filter((p) => !p.isSystem).length,
						tone: "blue"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Users covered",
						value: users.length
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsx("div", {
					className: "card-header",
					children: /* @__PURE__ */ jsxs(FilterBar, { children: [
						/* @__PURE__ */ jsx(SearchInput, {
							placeholder: "Search name or description…",
							value: q,
							onChange: setQ,
							width: 260
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Typical role",
							allLabel: "All roles",
							options: ROLE_OPTIONS,
							value: role,
							onChange: setRole
						}),
						/* @__PURE__ */ jsx(SelectFilter, {
							label: "Kind",
							allLabel: "All kinds",
							options: KIND_OPTIONS,
							value: kind,
							onChange: setKind
						})
					] })
				}), /* @__PURE__ */ jsx(DataTable, {
					caption: "Security profiles",
					columns: [
						{
							key: "profile",
							header: "Profile",
							render: (p) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Link, {
								to: paths.adminProfile(p.id),
								className: "table-link cell-main",
								children: p.name
							}), /* @__PURE__ */ jsx("span", {
								className: "cell-sub ref",
								children: p.id
							})] })
						},
						{
							key: "description",
							header: "Description",
							render: (p) => /* @__PURE__ */ jsx("span", {
								className: "cell-sub",
								style: {
									maxWidth: 420,
									whiteSpace: "normal"
								},
								children: p.description
							})
						},
						{
							key: "role",
							header: "Typical role",
							render: (p) => p.typicalRole
						},
						{
							key: "users",
							header: "Assigned users",
							numeric: true,
							render: (p) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: assignedCount(p.id)
							})
						},
						{
							key: "perms",
							header: "Permissions",
							numeric: true,
							render: (p) => /* @__PURE__ */ jsx("span", {
								className: "num",
								children: p.permissions.length
							})
						},
						{
							key: "kind",
							header: "Kind",
							render: (p) => p.isSystem ? /* @__PURE__ */ jsx("span", {
								className: "chip",
								children: "System profile"
							}) : /* @__PURE__ */ jsx("span", {
								className: "chip",
								children: "Custom"
							})
						},
						{
							key: "updated",
							header: "Last updated",
							hideMobile: true,
							render: (p) => /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
								className: "nowrap",
								children: fmtDateTime(p.updatedAt)
							}), /* @__PURE__ */ jsxs("span", {
								className: "cell-sub",
								children: ["by ", shortName(p.updatedByUserId)]
							})] })
						}
					],
					rows,
					rowKey: (p) => p.id,
					empty: /* @__PURE__ */ jsx(EmptyState, {
						icon: ShieldCheck,
						title: "No profiles match these filters",
						children: "Adjust the search or clear a filter to see the rest of the profile catalogue."
					}),
					footer: /* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: securityProfiles.length
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/admin/SecurityProfileDetailPage.tsx
function SecurityProfileDetailPage() {
	const { id = "" } = useParams();
	const profile = getProfile(id);
	if (!profile) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const assignedUsers = users.filter((u) => u.securityProfileIds.includes(profile.id));
	const grantedDomains = permissionDomains.filter((d) => d.actions.some((a) => profile.permissions.includes(`${d.key}.${a.key}`)));
	const noAccessDomains = permissionDomains.filter((d) => !grantedDomains.includes(d));
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(Breadcrumbs, { crumbs: [{
				label: "Security profiles",
				to: paths.adminProfiles
			}, { label: profile.name }] }),
			/* @__PURE__ */ jsx(EntityHeader, {
				identIcon: ShieldCheck,
				title: profile.name,
				badges: /* @__PURE__ */ jsxs(Fragment$1, { children: [profile.isSystem ? /* @__PURE__ */ jsx("span", {
					className: "chip",
					children: "System profile"
				}) : /* @__PURE__ */ jsx("span", {
					className: "chip",
					children: "Custom"
				}), /* @__PURE__ */ jsxs("span", {
					className: "chip",
					children: [profile.permissions.length, " permissions"]
				})] }),
				subtitle: profile.description,
				meta: [
					{
						label: "Typical role",
						value: profile.typicalRole
					},
					{
						label: "Profile ID",
						value: /* @__PURE__ */ jsx("span", {
							className: "ref",
							children: profile.id
						})
					},
					{
						label: "Updated",
						value: `${fmtDateTime(profile.updatedAt)} by ${shortName(profile.updatedByUserId)}`
					}
				],
				actions: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--secondary",
					children: "Duplicate profile"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "btn btn--primary",
					children: "Save changes"
				})] })
			}),
			profile.isSystem && /* @__PURE__ */ jsx(Banner, {
				tone: "warn",
				icon: /* @__PURE__ */ jsx(ShieldAlert, {
					size: 15,
					"aria-hidden": "true"
				}),
				children: "System profile — deletion is blocked and edits are restricted. Duplicate it to create a custom variant."
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "card-header",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "card-title",
						children: "Permission matrix"
					}), /* @__PURE__ */ jsx("span", {
						className: "card-sub",
						children: "Read / create / edit / approve / close-style grants per domain — editor preview, changes are not persisted."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "card-body",
					children: /* @__PURE__ */ jsx(PermissionMatrix, {
						granted: profile.permissions,
						editable: true
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "two-col",
				children: [/* @__PURE__ */ jsx("div", {
					className: "col-main",
					children: /* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "card-header",
								children: /* @__PURE__ */ jsx("h2", {
									className: "card-title",
									children: "Effective-permission preview"
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx("p", {
									className: "muted",
									style: { marginBottom: 10 },
									children: "What a user holding only this profile can do:"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "row-list",
								children: [grantedDomains.map((d) => {
									const actionLabels = d.actions.filter((a) => profile.permissions.includes(`${d.key}.${a.key}`)).map((a) => a.label);
									return /* @__PURE__ */ jsxs("div", {
										className: "row-list-item",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-main",
											children: [/* @__PURE__ */ jsx("div", {
												className: "row-title",
												children: d.label
											}), /* @__PURE__ */ jsx("div", {
												className: "row-sub",
												children: actionLabels.join(" · ")
											})]
										}), /* @__PURE__ */ jsx("div", {
											className: "row-end",
											children: /* @__PURE__ */ jsx("span", {
												className: "chip",
												children: actionLabels.length
											})
										})]
									}, d.key);
								}), noAccessDomains.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "row-list-item muted",
									children: ["No access: ", noAccessDomains.map((d) => d.label).join(", ")]
								})]
							})
						]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-side",
					children: [/* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "card-header",
							children: /* @__PURE__ */ jsx("h2", {
								className: "card-title",
								children: "Assigned users"
							})
						}), assignedUsers.length > 0 ? /* @__PURE__ */ jsx("div", {
							className: "row-list",
							children: assignedUsers.map((u) => /* @__PURE__ */ jsx("div", {
								className: "row-list-item",
								children: /* @__PURE__ */ jsx(UserChip, {
									userId: u.id,
									link: true,
									size: "sm"
								})
							}, u.id))
						}) : /* @__PURE__ */ jsx(EmptyState, {
							icon: Users,
							title: "No users assigned",
							children: "No accounts currently hold this security profile."
						})]
					}), /* @__PURE__ */ jsxs("section", {
						className: "card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "card-header",
							children: /* @__PURE__ */ jsx("h2", {
								className: "card-title",
								children: "Profile details"
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "card-body",
							children: /* @__PURE__ */ jsx(DetailGrid, { items: [
								{
									label: "Kind",
									value: profile.isSystem ? "System" : "Custom"
								},
								{
									label: "Typical role",
									value: profile.typicalRole
								},
								{
									label: "Created scope",
									value: "Account — AeroSync Regional Operations"
								},
								{
									label: "Last updated",
									value: `${fmtDateTimeFull(profile.updatedAt)} · ${shortName(profile.updatedByUserId)}`
								}
							] })
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/pages/admin/AuditLogsPage.tsx
var ACTION_GROUPS = [
	"auth",
	"defect",
	"work_order",
	"fleet_plan",
	"inventory",
	"signoff",
	"users",
	"security_profiles",
	"aircraft"
];
var OUTCOME_OPTIONS = ["Success", "Denied"];
function AuditLogsPage() {
	const [q, setQ] = useState("");
	const [userFilter, setUserFilter] = useState("");
	const [actionGroup, setActionGroup] = useState("");
	const [entityType, setEntityType] = useState("");
	const [outcome, setOutcome] = useState("");
	const [expandedId, setExpandedId] = useState(null);
	const userNames = useMemo(() => Array.from(new Set(auditLogs.map((a) => getUser(a.userId)?.name).filter((n) => Boolean(n)))).sort(), []);
	const entityTypes = useMemo(() => Array.from(new Set(auditLogs.map((a) => a.entityType))).sort(), []);
	const deniedCount = auditLogs.filter((a) => a.outcome === "Denied").length;
	const actorCount = useMemo(() => new Set(auditLogs.map((a) => a.userId)).size, []);
	const entityCount = useMemo(() => new Set(auditLogs.map((a) => a.entityRef)).size, []);
	const rows = useMemo(() => auditLogs.filter((a) => {
		const text = `${a.summary} ${a.action} ${a.entityRef}`.toLowerCase();
		if (q && !text.includes(q.toLowerCase())) return false;
		if (userFilter && getUser(a.userId)?.name !== userFilter) return false;
		if (actionGroup && !a.action.startsWith(actionGroup)) return false;
		if (entityType && a.entityType !== entityType) return false;
		if (outcome && a.outcome !== outcome) return false;
		return true;
	}), [
		q,
		userFilter,
		actionGroup,
		entityType,
		outcome
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Administration" }, { label: "Audit logs" }],
				title: "Audit logs",
				description: "An append-only trail of every action taken in AeroSync MRO — who did what, when, from where, and what changed.",
				actions: /* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "btn btn--secondary",
					children: [/* @__PURE__ */ jsx(Download, {
						size: 15,
						"aria-hidden": "true"
					}), "Export (visual)"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "metric-grid",
				children: [
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Entries",
						value: `${auditLogs.length} shown`,
						icon: ScrollText
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Denied outcomes",
						value: deniedCount,
						tone: "red"
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Actors",
						value: actorCount
					}),
					/* @__PURE__ */ jsx(MetricCard, {
						label: "Entities touched",
						value: entityCount
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "card-header",
						children: /* @__PURE__ */ jsxs(FilterBar, { children: [
							/* @__PURE__ */ jsx(SearchInput, {
								placeholder: "Search summary, action, entity…",
								value: q,
								onChange: setQ,
								width: 260
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "User",
								allLabel: "All users",
								options: userNames,
								value: userFilter,
								onChange: setUserFilter
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Action group",
								allLabel: "All actions",
								options: ACTION_GROUPS,
								value: actionGroup,
								onChange: setActionGroup
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Entity type",
								allLabel: "All entities",
								options: entityTypes,
								value: entityType,
								onChange: setEntityType
							}),
							/* @__PURE__ */ jsx(SelectFilter, {
								label: "Outcome",
								allLabel: "All outcomes",
								options: OUTCOME_OPTIONS,
								value: outcome,
								onChange: setOutcome
							})
						] })
					}),
					rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
						icon: ScrollText,
						title: "No entries match these filters",
						children: "Adjust the search or clear a filter to see the rest of the trail."
					}) : /* @__PURE__ */ jsx("div", {
						className: "table-wrap",
						children: /* @__PURE__ */ jsxs("table", {
							className: "data-table",
							children: [
								/* @__PURE__ */ jsx("caption", {
									className: "visually-hidden",
									children: "Audit log entries"
								}),
								/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										scope: "col",
										children: "Time"
									}),
									/* @__PURE__ */ jsx("th", {
										scope: "col",
										children: "User"
									}),
									/* @__PURE__ */ jsx("th", {
										scope: "col",
										children: "Role"
									}),
									/* @__PURE__ */ jsx("th", {
										scope: "col",
										children: "Action"
									}),
									/* @__PURE__ */ jsx("th", {
										scope: "col",
										children: "Entity"
									}),
									/* @__PURE__ */ jsx("th", {
										scope: "col",
										children: "Summary"
									}),
									/* @__PURE__ */ jsx("th", {
										scope: "col",
										className: "hide-mobile",
										children: "Source"
									}),
									/* @__PURE__ */ jsx("th", {
										scope: "col",
										children: "Outcome"
									}),
									/* @__PURE__ */ jsx("th", {
										scope: "col",
										"aria-hidden": "true"
									})
								] }) }),
								/* @__PURE__ */ jsx("tbody", { children: rows.map((a) => {
									const expanded = expandedId === a.id;
									const before = a.before;
									const after = a.after;
									const keys = Array.from(/* @__PURE__ */ new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]));
									return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsxs("td", { children: [/* @__PURE__ */ jsx("span", {
											className: "nowrap",
											children: fmtDateTime(a.at)
										}), /* @__PURE__ */ jsx("span", {
											className: "cell-sub",
											children: fmtRelative(a.at)
										})] }),
										/* @__PURE__ */ jsx("td", { children: shortName(a.userId) }),
										/* @__PURE__ */ jsx("td", {
											className: "muted",
											children: a.role
										}),
										/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
											className: "ref",
											children: a.action
										}) }),
										/* @__PURE__ */ jsxs("td", { children: [/* @__PURE__ */ jsx("span", {
											className: "cell-main",
											children: a.entityType
										}), /* @__PURE__ */ jsx("span", {
											className: "cell-sub",
											children: a.entityLink ? /* @__PURE__ */ jsx(Link, {
												to: a.entityLink,
												className: "table-link ref",
												children: a.entityRef
											}) : /* @__PURE__ */ jsx("span", {
												className: "ref",
												children: a.entityRef
											})
										})] }),
										/* @__PURE__ */ jsx("td", { children: a.summary }),
										/* @__PURE__ */ jsx("td", {
											className: "hide-mobile",
											children: /* @__PURE__ */ jsx("span", {
												className: "ref",
												children: a.sourceIp
											})
										}),
										/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(StatusBadge, { status: a.outcome }) }),
										/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("button", {
											type: "button",
											className: "icon-btn",
											"aria-expanded": expanded,
											"aria-label": expanded ? `Collapse details for ${a.id}` : `Expand details for ${a.id}`,
											onClick: () => setExpandedId(expanded ? null : a.id),
											children: expanded ? /* @__PURE__ */ jsx(ChevronUp, {
												size: 15,
												"aria-hidden": "true"
											}) : /* @__PURE__ */ jsx(ChevronDown, {
												size: 15,
												"aria-hidden": "true"
											})
										}) })
									] }), expanded && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
										colSpan: 9,
										style: { background: "var(--surface-sunken)" },
										children: /* @__PURE__ */ jsxs("div", {
											style: {
												padding: "12px 4px",
												display: "flex",
												flexDirection: "column",
												gap: 14
											},
											children: [/* @__PURE__ */ jsx(DetailGrid, { items: [
												{
													label: "Entry ID",
													value: /* @__PURE__ */ jsx("span", {
														className: "ref",
														children: a.id
													})
												},
												{
													label: "Timestamp",
													value: fmtDateTimeFull(a.at)
												},
												{
													label: "Source IP",
													value: /* @__PURE__ */ jsx("span", {
														className: "ref",
														children: a.sourceIp
													})
												},
												{
													label: "Outcome",
													value: /* @__PURE__ */ jsx(StatusBadge, { status: a.outcome })
												}
											] }), before || after ? /* @__PURE__ */ jsxs("div", {
												className: "diff-grid",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "diff-col",
													children: [/* @__PURE__ */ jsx("h4", { children: "Previous state" }), /* @__PURE__ */ jsx("div", {
														className: "diff-block diff-block--old",
														children: keys.map((k) => /* @__PURE__ */ jsxs("div", {
															className: "diff-row",
															"data-changed": before?.[k] !== after?.[k],
															children: [/* @__PURE__ */ jsx("span", {
																className: "diff-key",
																children: k
															}), /* @__PURE__ */ jsx("span", { children: before?.[k] ?? "—" })]
														}, k))
													})]
												}), /* @__PURE__ */ jsxs("div", {
													className: "diff-col",
													children: [/* @__PURE__ */ jsx("h4", { children: "New state" }), /* @__PURE__ */ jsx("div", {
														className: "diff-block diff-block--new",
														children: keys.map((k) => /* @__PURE__ */ jsxs("div", {
															className: "diff-row",
															"data-changed": before?.[k] !== after?.[k],
															children: [/* @__PURE__ */ jsx("span", {
																className: "diff-key",
																children: k
															}), /* @__PURE__ */ jsx("span", { children: after?.[k] ?? "—" })]
														}, k))
													})]
												})]
											}) : /* @__PURE__ */ jsx("p", {
												className: "muted",
												children: "No state snapshot recorded for this action (informational event)."
											})]
										})
									}) })] }, a.id);
								}) })
							]
						})
					}),
					/* @__PURE__ */ jsx(TableFooter, {
						shown: rows.length,
						total: auditLogs.length
					})
				]
			})
		]
	});
}
//#endregion
//#region src/pages/admin/SettingsPage.tsx
var NAV_ITEMS = [
	{
		href: "#operator",
		label: "Operator"
	},
	{
		href: "#branding",
		label: "Branding"
	},
	{
		href: "#references",
		label: "Reference formats"
	},
	{
		href: "#timezone",
		label: "Time zone & bases"
	},
	{
		href: "#statuses",
		label: "Status configuration"
	},
	{
		href: "#notifications",
		label: "Notifications"
	},
	{
		href: "#security",
		label: "Security"
	},
	{
		href: "#disclaimer",
		label: "Prototype disclaimer"
	}
];
var BASES = [
	{
		code: "MEL",
		name: "Melbourne Airport",
		kind: "Primary"
	},
	{
		code: "MQL",
		name: "Mildura",
		kind: "Line station"
	},
	{
		code: "ABX",
		name: "Albury",
		kind: "Line station"
	},
	{
		code: "WGA",
		name: "Wagga Wagga",
		kind: "Port"
	}
];
var STATUS_ROWS = [
	{
		tone: "green",
		statuses: [
			"Available",
			"Clear",
			"Serviceable",
			"Closed"
		]
	},
	{
		tone: "amber",
		statuses: [
			"Monitor",
			"Restricted",
			"Assigned"
		]
	},
	{
		tone: "orange",
		statuses: [
			"At Risk",
			"Awaiting Parts",
			"Awaiting Sign-off"
		]
	},
	{
		tone: "red",
		statuses: [
			"AOG",
			"No Go",
			"Critical"
		]
	},
	{
		tone: "grey",
		statuses: ["Cancelled", "Archived"]
	},
	{
		tone: "blue",
		statuses: [
			"Open",
			"Reported",
			"In Progress"
		]
	}
];
function SettingsPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "page",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			crumbs: [{ label: "Administration" }, { label: "Settings" }],
			title: "Settings",
			description: "Operator configuration, reference-number formats, operational bases and the disclaimer shown across the application.",
			actions: /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "btn btn--primary",
				children: "Save all changes"
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "settings-layout",
			children: [/* @__PURE__ */ jsx("nav", {
				className: "settings-nav",
				"aria-label": "Settings sections",
				children: NAV_ITEMS.map((item, i) => /* @__PURE__ */ jsx("a", {
					href: item.href,
					"aria-current": i === 0 ? "true" : void 0,
					children: item.label
				}, item.href))
			}), /* @__PURE__ */ jsxs("div", {
				className: "form-stack",
				children: [
					/* @__PURE__ */ jsxs("section", {
						className: "card",
						id: "operator",
						children: [/* @__PURE__ */ jsx("div", {
							className: "form-section-head",
							children: /* @__PURE__ */ jsx("h2", { children: "Operator details" })
						}), /* @__PURE__ */ jsxs("form", {
							className: "form-grid",
							onSubmit: (e) => e.preventDefault(),
							"aria-label": "Operator details",
							children: [
								/* @__PURE__ */ jsx(TextField, {
									id: "settings-operator-name",
									label: "Operator name",
									defaultValue: "AeroSync Regional Operations"
								}),
								/* @__PURE__ */ jsx(TextField, {
									id: "settings-operator-code",
									label: "Operator code",
									defaultValue: "ASR"
								}),
								/* @__PURE__ */ jsx(TextField, {
									id: "settings-operator-email",
									label: "Primary contact email",
									type: "email",
									defaultValue: "marcus.hale@aerosync.example"
								}),
								/* @__PURE__ */ jsx(TextField, {
									id: "settings-operator-aoc",
									label: "AOC reference",
									defaultValue: "AOC-2025-114 (fictional)"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "card",
						id: "branding",
						children: [/* @__PURE__ */ jsx("div", {
							className: "form-section-head",
							children: /* @__PURE__ */ jsx("h2", { children: "Branding" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "form-grid",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "field field--full",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "settings-brand-preview",
										children: "Brand mark"
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 12
										},
										children: [/* @__PURE__ */ jsx("span", {
											id: "settings-brand-preview",
											style: {
												background: "var(--nav-bg)",
												borderRadius: "var(--radius-md)",
												display: "inline-flex",
												padding: 6
											},
											children: /* @__PURE__ */ jsx(BrandMark, { size: 40 })
										}), /* @__PURE__ */ jsx("span", {
											className: "field-hint",
											children: "Fixed mark for this preview build — replacement upload isn't wired up."
										})]
									})]
								}),
								/* @__PURE__ */ jsx(TextField, {
									id: "settings-accent",
									label: "Accent colour",
									defaultValue: "#1D5FD6",
									hint: "Applied to actions and active navigation"
								}),
								/* @__PURE__ */ jsx(SelectField, {
									id: "settings-sidebar-theme",
									label: "Sidebar theme",
									options: ["Deep navy (default)", "Slate"],
									defaultValue: "Deep navy (default)"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "card",
						id: "references",
						children: [/* @__PURE__ */ jsx("div", {
							className: "form-section-head",
							children: /* @__PURE__ */ jsx("h2", { children: "Reference-number formats" })
						}), /* @__PURE__ */ jsxs("form", {
							className: "form-grid",
							onSubmit: (e) => e.preventDefault(),
							"aria-label": "Reference-number formats",
							children: [
								/* @__PURE__ */ jsx(TextField, {
									id: "settings-ref-defect",
									label: "Defects",
									defaultValue: "DEF-{YYYY}-{seq:4}",
									hint: "Next: DEF-2026-0049"
								}),
								/* @__PURE__ */ jsx(TextField, {
									id: "settings-ref-wo",
									label: "Work orders",
									defaultValue: "WO-{YYYY}-{seq:4}",
									hint: "Next: WO-2026-0039"
								}),
								/* @__PURE__ */ jsx(TextField, {
									id: "settings-ref-signoff",
									label: "Sign-offs",
									defaultValue: "SO-{YYYY}-{seq:4}",
									hint: "Next: SO-2026-0019"
								}),
								/* @__PURE__ */ jsx(TextField, {
									id: "settings-ref-plan",
									label: "Fleet plans",
									defaultValue: "FP-{YYYY}-{MMDD}",
									hint: "Next: FP-2026-0716"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "card",
						id: "timezone",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "form-section-head",
								children: /* @__PURE__ */ jsx("h2", { children: "Time zone & operational bases" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "form-grid",
								children: [/* @__PURE__ */ jsx(SelectField, {
									id: "settings-timezone",
									label: "Time zone",
									options: [
										"Australia/Melbourne (AEST/AEDT)",
										"Australia/Sydney",
										"Australia/Brisbane"
									],
									defaultValue: "Australia/Melbourne (AEST/AEDT)"
								}), /* @__PURE__ */ jsx(CheckRow, {
									id: "settings-show-utc",
									label: "Show UTC alongside local times"
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: BASES.map((b) => /* @__PURE__ */ jsxs("div", {
									className: "row-list-item",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "row-main",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "row-title",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "ref",
													children: b.code
												}),
												" ",
												b.name,
												b.kind === "Primary" && /* @__PURE__ */ jsx("span", {
													className: "chip",
													children: "Primary"
												})
											]
										}), /* @__PURE__ */ jsx("div", {
											className: "row-sub",
											children: b.kind === "Primary" ? "Home base" : b.kind
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "row-end",
										children: /* @__PURE__ */ jsx("button", {
											type: "button",
											className: "btn btn--ghost btn--sm",
											children: "Edit"
										})
									})]
								}, b.code))
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "card",
						id: "statuses",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "form-section-head",
								children: [/* @__PURE__ */ jsx("h2", { children: "Status configuration preview" }), /* @__PURE__ */ jsx("p", { children: "The documented tone vocabulary used across every badge in the application." })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "row-list",
								children: STATUS_ROWS.map((row) => /* @__PURE__ */ jsx("div", {
									className: "row-list-item",
									children: /* @__PURE__ */ jsx("div", {
										className: "row-main",
										children: /* @__PURE__ */ jsx("div", {
											className: "row-title",
											style: { flexWrap: "wrap" },
											children: row.statuses.map((s) => /* @__PURE__ */ jsx(StatusBadge, { status: s }, s))
										})
									})
								}, row.tone))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsx("p", {
									className: "muted",
									style: { fontSize: "var(--fs-sm)" },
									children: "Transitions between these statuses are enforced by the workflow engine in the full product — this preview only displays the tone mapping."
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "card",
						id: "notifications",
						children: [/* @__PURE__ */ jsx("div", {
							className: "form-section-head",
							children: /* @__PURE__ */ jsx("h2", { children: "Notification preferences" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							style: {
								display: "flex",
								flexDirection: "column",
								gap: 12
							},
							children: [
								/* @__PURE__ */ jsx(CheckRow, {
									id: "settings-notif-aog",
									label: "AOG events — immediate, all controllers",
									defaultChecked: true
								}),
								/* @__PURE__ */ jsx(CheckRow, {
									id: "settings-notif-defect",
									label: "Defect reported — controller queue digest",
									defaultChecked: true
								}),
								/* @__PURE__ */ jsx(CheckRow, {
									id: "settings-notif-signoff",
									label: "Work order ready for sign-off — notify licensed engineers",
									defaultChecked: true
								}),
								/* @__PURE__ */ jsx(CheckRow, {
									id: "settings-notif-parts",
									label: "Parts backorder updates — stores and requester",
									defaultChecked: true
								}),
								/* @__PURE__ */ jsx(CheckRow, {
									id: "settings-notif-daily",
									label: "Daily fleet summary email — 06:00 local"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "card",
						id: "security",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "form-section-head",
								children: /* @__PURE__ */ jsx("h2", { children: "Security settings" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "form-grid",
								children: [
									/* @__PURE__ */ jsx(SelectField, {
										id: "settings-session-timeout",
										label: "Session timeout",
										options: [
											"30 minutes",
											"1 hour",
											"4 hours",
											"8 hours"
										],
										defaultValue: "4 hours"
									}),
									/* @__PURE__ */ jsx(TextField, {
										id: "settings-password-policy",
										label: "Password policy",
										defaultValue: "Min 12 chars · number · symbol"
									}),
									/* @__PURE__ */ jsx(CheckRow, {
										id: "settings-mfa",
										label: "Require MFA for Admin and Licensed Engineer roles",
										defaultChecked: true
									}),
									/* @__PURE__ */ jsx(CheckRow, {
										id: "settings-ip-allowlist",
										label: "IP allow-list for admin routes"
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "card-body",
								children: /* @__PURE__ */ jsxs("p", {
									className: "muted",
									style: { fontSize: "var(--fs-sm)" },
									children: [
										"Detailed permission grants live in ",
										/* @__PURE__ */ jsx(Link, {
											to: paths.adminProfiles,
											children: "Security profiles"
										}),
										", not here."
									]
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "card",
						id: "disclaimer",
						children: [/* @__PURE__ */ jsx("div", {
							className: "form-section-head",
							children: /* @__PURE__ */ jsx("h2", { children: "Prototype disclaimer" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "form-grid",
							children: [/* @__PURE__ */ jsx(TextAreaField, {
								id: "settings-disclaimer-text",
								label: "Disclaimer text",
								full: true,
								defaultValue: "Prototype — not for operational use or airworthiness decisions.",
								hint: "Shown persistently in the application footer and on formal documents."
							}), /* @__PURE__ */ jsx(CheckRow, {
								id: "settings-disclaimer-print",
								label: "Show disclaimer on printed/exported documents",
								defaultChecked: true
							})]
						})]
					}),
					/* @__PURE__ */ jsx(Banner, {
						tone: "neutral",
						children: "Settings are a visual preview — values are not persisted."
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/app/AppRoutes.tsx
/**
* Central route table. Every route renders a deliberate page; the
* wildcard renders the shell-preserving not-found page.
*/
function AppRoutes() {
	return /* @__PURE__ */ jsxs(Routes, { children: [
		/* @__PURE__ */ jsx(Route, {
			path: "/login",
			element: /* @__PURE__ */ jsx(LoginPage, {})
		}),
		/* @__PURE__ */ jsx(Route, {
			path: "/forgot-password",
			element: /* @__PURE__ */ jsx(ForgotPasswordPage, {})
		}),
		/* @__PURE__ */ jsx(Route, {
			path: "/invite/:token",
			element: /* @__PURE__ */ jsx(InvitePage, {})
		}),
		/* @__PURE__ */ jsxs(Route, {
			element: /* @__PURE__ */ jsx(AppShell, {}),
			children: [
				/* @__PURE__ */ jsx(Route, {
					path: "/",
					element: /* @__PURE__ */ jsx(DashboardPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/fleet/availability",
					element: /* @__PURE__ */ jsx(FleetAvailabilityPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/fleet/plans",
					element: /* @__PURE__ */ jsx(FleetPlansPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/fleet/plans/new",
					element: /* @__PURE__ */ jsx(FleetPlanFormPage, { mode: "new" })
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/fleet/plans/:id",
					element: /* @__PURE__ */ jsx(FleetPlanDetailPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/fleet/plans/:id/edit",
					element: /* @__PURE__ */ jsx(FleetPlanFormPage, { mode: "edit" })
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/fleet/planned-maintenance",
					element: /* @__PURE__ */ jsx(PlannedMaintenancePage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/aircraft",
					element: /* @__PURE__ */ jsx(AircraftListPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/aircraft/new",
					element: /* @__PURE__ */ jsx(AircraftFormPage, { mode: "new" })
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/aircraft/:id",
					element: /* @__PURE__ */ jsx(AircraftDetailPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/aircraft/:id/edit",
					element: /* @__PURE__ */ jsx(AircraftFormPage, { mode: "edit" })
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/aircraft/:id/records",
					element: /* @__PURE__ */ jsx(AircraftRecordsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/flights",
					element: /* @__PURE__ */ jsx(FlightsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/flights/new",
					element: /* @__PURE__ */ jsx(FlightFormPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/flights/:id",
					element: /* @__PURE__ */ jsx(FlightDetailPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/defects",
					element: /* @__PURE__ */ jsx(DefectsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/defects/new",
					element: /* @__PURE__ */ jsx(DefectReportPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/defects/review",
					element: /* @__PURE__ */ jsx(DefectReviewPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/defects/:id",
					element: /* @__PURE__ */ jsx(DefectDetailPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/work-orders",
					element: /* @__PURE__ */ jsx(WorkOrdersPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/work-orders/new",
					element: /* @__PURE__ */ jsx(WorkOrderFormPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/work-orders/mine",
					element: /* @__PURE__ */ jsx(MyWorkOrdersPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/work-orders/:id",
					element: /* @__PURE__ */ jsx(WorkOrderDetailPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/work-orders/:id/sign-off",
					element: /* @__PURE__ */ jsx(SignOffPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/sign-offs",
					element: /* @__PURE__ */ jsx(SignOffsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/records",
					element: /* @__PURE__ */ jsx(MaintenanceRecordsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/inventory/parts",
					element: /* @__PURE__ */ jsx(PartsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/inventory/stock",
					element: /* @__PURE__ */ jsx(StockPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/inventory/transactions",
					element: /* @__PURE__ */ jsx(TransactionsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/inventory/requests",
					element: /* @__PURE__ */ jsx(RequestsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/accounts",
					element: /* @__PURE__ */ jsx(AccountsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/accounts/:id",
					element: /* @__PURE__ */ jsx(AccountDetailPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/accounts/:id/cost-centres",
					element: /* @__PURE__ */ jsx(CostCentresPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/reports",
					element: /* @__PURE__ */ jsx(ReportsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/admin/users",
					element: /* @__PURE__ */ jsx(UsersPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/admin/users/:id",
					element: /* @__PURE__ */ jsx(UserDetailPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/admin/security-profiles",
					element: /* @__PURE__ */ jsx(SecurityProfilesPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/admin/security-profiles/:id",
					element: /* @__PURE__ */ jsx(SecurityProfileDetailPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/admin/audit-logs",
					element: /* @__PURE__ */ jsx(AuditLogsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "/admin/settings",
					element: /* @__PURE__ */ jsx(SettingsPage, {})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "*",
					element: /* @__PURE__ */ jsx(NotFoundPage, {})
				})
			]
		})
	] });
}
//#endregion
//#region scripts/smoke.tsx
/**
* Route smoke test for the AeroSync MRO design preview.
*
* Server-renders EVERY route (static routes plus one concrete page per
* entity id in the mock dataset), then:
*   1. fails if any route throws or renders suspiciously little HTML
*   2. extracts every internal <a href> and fails on links that do not
*      resolve to a rendered route (dead-end detection)
*   3. fails if banned placeholder wording appears in rendered output
*
* Build & run (no extra dependencies — uses the app's own toolchain):
*   npx vite build --ssr scripts/smoke.tsx --outDir dist-smoke --emptyOutDir
*   node dist-smoke/smoke.js
*/
var routes = [
	paths.login,
	paths.forgotPassword,
	paths.invite("PRV-88XK21"),
	paths.dashboard,
	paths.fleetAvailability,
	paths.fleetPlans,
	paths.fleetPlanNew,
	...fleetPlans.map((p) => paths.fleetPlan(p.id)),
	...fleetPlans.map((p) => paths.fleetPlanEdit(p.id)),
	paths.plannedMaintenance,
	paths.aircraftList,
	paths.aircraftNew,
	...aircraft.map((a) => paths.aircraftDetail(a.id)),
	...aircraft.map((a) => paths.aircraftEdit(a.id)),
	...aircraft.map((a) => paths.aircraftRecords(a.id)),
	paths.flights,
	paths.flightNew,
	...flights.map((f) => paths.flight(f.id)),
	paths.defects,
	paths.defectNew,
	paths.defectReview,
	...defects.map((d) => paths.defect(d.id)),
	paths.workOrders,
	paths.workOrderNew,
	paths.myWorkOrders,
	...workOrders.map((w) => paths.workOrder(w.id)),
	...workOrders.map((w) => paths.workOrderSignOff(w.id)),
	paths.signOffs,
	paths.maintenanceRecords,
	paths.inventoryParts,
	paths.inventoryStock,
	paths.inventoryTransactions,
	paths.inventoryRequests,
	paths.accounts,
	...accounts.map((a) => paths.account(a.id)),
	...accounts.map((a) => paths.accountCostCentres(a.id)),
	paths.reports,
	paths.adminUsers,
	...users.map((u) => paths.adminUser(u.id)),
	paths.adminProfiles,
	...securityProfiles.map((p) => paths.adminProfile(p.id)),
	paths.adminAuditLogs,
	paths.adminSettings,
	"/definitely-not-a-route"
];
var BANNED = [
	/coming soon/i,
	/\bTODO\b/,
	/lorem ipsum/i,
	/under construction/i
];
var validTargets = new Set(routes.filter((r) => r !== "/definitely-not-a-route"));
var failures = [];
var deadLinks = /* @__PURE__ */ new Map();
var rendered = 0;
for (const route of routes) {
	let html = "";
	try {
		html = renderToString(/* @__PURE__ */ jsx(MemoryRouter, {
			initialEntries: [route],
			children: /* @__PURE__ */ jsx(AppRoutes, {})
		}));
		rendered++;
	} catch (err) {
		failures.push(`RENDER FAIL ${route}: ${err instanceof Error ? err.message : String(err)}`);
		continue;
	}
	if (html.length < 1e3) failures.push(`SUSPICIOUSLY EMPTY ${route}: ${html.length} chars`);
	for (const re of BANNED) if (re.test(html)) failures.push(`BANNED TEXT ${route}: matches ${re}`);
	for (const match of html.matchAll(/href="([^"]+)"/g)) {
		const href = match[1];
		if (!href.startsWith("/")) continue;
		const clean = href.split("#")[0].split("?")[0];
		if (clean === "" || clean === route) continue;
		if (!validTargets.has(clean)) {
			if (!deadLinks.has(clean)) deadLinks.set(clean, /* @__PURE__ */ new Set());
			deadLinks.get(clean).add(route);
		}
	}
}
for (const [target, sources] of deadLinks) failures.push(`DEAD LINK ${target} (from ${[...sources].slice(0, 4).join(", ")}${sources.size > 4 ? "…" : ""})`);
console.log(`\nSmoke test: rendered ${rendered}/${routes.length} routes`);
if (failures.length > 0) {
	console.error(`\n${failures.length} failure(s):`);
	for (const f of failures) console.error(`  ✗ ${f}`);
	process.exit(1);
}
console.log("All routes render, no dead links, no banned wording. ✓");
//#endregion
export {};
