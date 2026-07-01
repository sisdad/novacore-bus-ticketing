import React from "react";
import {
  Building,
  People,
  Signpost,
  BusFront,
  TicketPerforated,
  CashStack,
  PersonBadge,
  BarChartFill,
} from "react-bootstrap-icons";

export default function DashboardCards({
  stations = [],
  managers = [],
  routes = [],
  vehicles = [],
  staff = [],
  revenue = 0,
  tickets = 0,
}) {
  const cards = [
    {
      title: "Stations",
      value: stations.length,
      icon: <Building size={35} />,
      color: "blue",
    },
    {
      title: "Managers",
      value: managers.length,
      icon: <People size={35} />,
      color: "green",
    },
    {
      title: "Routes",
      value: routes.length,
      icon: <Signpost size={35} />,
      color: "orange",
    },
    {
      title: "Vehicles",
      value: vehicles.length,
      icon: <BusFront size={35} />,
      color: "red",
    },
    {
      title: "Staff",
      value: staff.length,
      icon: <PersonBadge size={35} />,
      color: "blue",
    },
    {
      title: "Tickets",
      value: tickets,
      icon: <TicketPerforated size={35} />,
      color: "green",
    },
    {
      title: "Revenue",
      value: `${Number(revenue).toLocaleString()} ETB`,
      icon: <CashStack size={35} />,
      color: "orange",
    },
    {
      title: "Reports",
      value: "View",
      icon: <BarChartFill size={35} />,
      color: "red",
    },
  ];

  return (
    <div className="row g-4 mb-4">
      {cards.map((card, index) => (
        <div className="col-lg-3 col-md-6 col-sm-12" key={index}>
          <div className={`stat-card ${card.color}`}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50">{card.title}</h6>

                <h2 className="fw-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div>{card.icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}