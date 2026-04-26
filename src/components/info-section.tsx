interface InfoSectionProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  content: (string | React.ReactNode)[];
}

function InfoSection({ icon: Icon, title, content }: Readonly<InfoSectionProps>) {
  return (
    <div className="flex space-x-4">
      <div className="shrink-0">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-primary">{title}</h3>
        <ul className="mt-2 text-sm text-primary">
          {content.map((item, index) => (
            <li className="list-disc" key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default InfoSection;
