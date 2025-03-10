import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SearchModal } from "../search-modal";
import { useDebounce } from "@/hooks";

interface SearchProps {
  className?: string;
  placeholder: string;
  transparent?: boolean;
  setIsSearchExpanded: (data: boolean) => void;
}

interface SearchPayload {
  search: string;
}

const searchFormSchema = yup.object().shape({
  search: yup.string().required("Search is required"),
});

const Search: React.FC<SearchProps> = ({
  className,
  placeholder,
  transparent,
  setIsSearchExpanded,
}) => {
  const {
    formState: { errors },
    watch,
  } = useForm<SearchPayload>({
    resolver: yupResolver(searchFormSchema),
  });
  const [searchValue, setSearchValue] = useState<string>('');
  const [isSearchModal, setIsSearchModal] = useState(false);
    const debouncedSearch = useDebounce(searchValue, 500);

  const handleClose = () => {
    setIsSearchModal(false)
  }

  const handleChange = (val: string) => {
    setSearchValue(val);

    if (val !== '') {
      setIsSearchModal(true);
    } else {
      setIsSearchModal(false);
    }
  };

  return (
    <>
      <div
        className={`
        flex items-center rounded-lg border border-gray-300 px-3.5 py-2
        ${className}
        ${transparent ? "bg-transparent" : "bg-white"}
      `}
      >
        <SearchIcon className="mr-2 h-4.5 w-4.5 min-w-[18px] text-gray-500" />
        <input
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsSearchExpanded(true)}
          onBlur={() => {
            setIsSearchExpanded(false);
          }}
          value={watch("search")}
          placeholder={placeholder}
          type="search"
          className="
          w-full h-full border-none bg-transparent text-gray-600 font-light text-sm
          focus:outline-none placeholder-gray-500 placeholder:text-xs sm:placeholder:text-xs
        "
        />
        {errors.search && <p className="text-red-500 text-sm">{errors.search.message}</p>}
      </div>
      {isSearchModal && (
        <SearchModal
          searchText={debouncedSearch}
          isOpen={isSearchModal}
          onClose={handleClose}
        />
      )}
    </>

  );
};

export { Search };
